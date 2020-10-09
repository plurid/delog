// #region imports
    // #region libraries
    import Deon from '@plurid/deon';
    // #endregion libraries


    // #region external
    import {
        LoggedRecord,
        Tester as ITester,
        TesterConfiguration,
        TesterCall,
        RequiredTesterConfiguration,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const makeRequiredTesterConfiguration = (
    data: TesterConfiguration
) => {
    const {
        phases,
        timeout,
    } = data;

    const startDelay = data.startDelay ?? 5_000;
    const retryDelay = data.retryDelay ?? startDelay;

    const requiredTesterConfiguration: RequiredTesterConfiguration = {
        phases,
        startDelay,
        retryDelay,
        timeout: timeout ?? 60_000,
    };

    return requiredTesterConfiguration;
}


const parseConfiguration = async (
    data: string,
) => {
    try {
        const deon = new Deon();

        const parsedData: TesterConfiguration = await deon.parse(data);

        return makeRequiredTesterConfiguration(parsedData);
    } catch (error) {
        try {
            const parsedData: TesterConfiguration = JSON.parse(data);

            return makeRequiredTesterConfiguration(parsedData);
        } catch (error) {
            return;
        }
    }
}


const compareRecords = (
    a: LoggedRecord,
    b: LoggedRecord,
) => {
    if (
        !a.context
        || !b.context
        || !a.context.sharedOrder
        || !b.context.sharedOrder
    ) {
        return 0;
    }

    if (a.context.sharedOrder < b.context.sharedOrder) {
        return -1;
    }

    if (a.context.sharedOrder > b.context.sharedOrder) {
        return 1;
    }

    return 0;
}


class Tester {
    private calls: Record<string, TesterCall> = {};
    private interval: number = 0;


    public async test(
        log: LoggedRecord,
    ) {
        try {
            const isTestingLog = this.checkTestingLog(
                log,
            );

            if (!isTestingLog) {
                return;
            }

            const sharedID = log.context?.sharedID as string;

            const called = this.calls[sharedID];

            if (!called) {
                const ownedBy = log.ownedBy;
                const project = log.project as string;
                const suite = log.context?.suite as string;
                const scenario = log.context?.scenario as string;

                // check if tests have a test with the sharedID
                const testInDatabase: any[] = await database.query(
                    'tests',
                    'id',
                    sharedID,
                );

                if (testInDatabase[0]) {
                    return;
                }

                // get tester
                const testerAggregate: ITester[] = await database.aggregate(
                    'testers',
                    [
                        {
                            '$match': {
                                ownedBy,
                                project,
                                suite,
                                scenario,
                            },
                        },
                    ],
                );

                const tester = testerAggregate[0];

                if (!tester) {
                    return;
                }

                // set tester call
                const contact = await this.setCall(
                    sharedID,
                    tester,
                );

                // write test base to databasee
                const testStore = {
                    id: sharedID,
                    contact,
                };

                await database.store(
                    'tests',
                    sharedID,
                    testStore,
                );
            }

            this.testRunner();
        } catch (error) {
            return;
        }
    }


    private checkTestingLog(
        log: LoggedRecord,
    ) {
        const {
            context,
            project,
        } = log;

        if (!context) {
            return false;
        }

        const {
            mode,
            suite,
            scenario,
            sharedID,
            sharedOrder,
        } = context;

        if (mode !== 'TESTING') {
            return false;
        }

        if (
            !project
            || !suite
            || !scenario
            || !sharedID
            || typeof sharedOrder === 'undefined'
        ) {
            return false;
        }

        return true;
    }

    private testRunner() {
        if (this.interval) {
            return;
        }

        this.interval = setInterval(
            () => {
                this.testRunnerLoop();
            },
            1000,
        );
    }

    private testRunnerLoop() {
        if (Object.entries(this.calls).length === 0) {
            clearInterval(this.interval);
            this.interval = 0;
            return;
        }

        const now = Date.now();

        for (const [id, call] of Object.entries(this.calls)) {
            const {
                contact,
                configuration,
            } = call;

            // check if the past is above the delay threshold
            const testTime = contact + configuration.startDelay;

            if (testTime > now) {
                // try to handle test
                this.handleTester(id);
            }

            // continue;
        }
    }

    private async setCall(
        id: string,
        data: ITester,
    ) {
        const configuration = await parseConfiguration(
            data.configuration,
        );

        if (!configuration) {
            return;
        }

        const contact = Date.now();

        this.calls[id] = {
            contact,
            data,
            configuration,
        };

        return contact;
    }

    private unsetCall(
        id: string,
    ) {
        delete this.calls[id];
    }

    private async handleTester(
        callID: string,
    ) {
        const testerCall = this.calls[callID];

        if (!testerCall) {
            return;
        }

        const records: LoggedRecord[] = await database.aggregate(
            'records',
            [
                {
                    '$match': {
                        'context.sharedID': callID,
                    },
                },
            ],
        );

        if (records.length === 0) {
            return;
        }

        const sortedRecords = records.sort(compareRecords);

        const {
            configuration,
        } = testerCall;

        const {
            phases,
        } = configuration;

        let testStatus = true;

        for (const [index, record] of sortedRecords.entries()) {
            if (record.text !== phases[index].text) {
                // test failed
                testStatus = false;
                break;
            }
        }

        const testStore = {
            id: callID,
            status: testStatus,
        };

        await database.store(
            'tests',
            callID,
            testStore,
        );

        this.unsetCall(
            callID,
        );
    }
}
// #endregion module



// #region exports
export default Tester;
// #endregion exports
