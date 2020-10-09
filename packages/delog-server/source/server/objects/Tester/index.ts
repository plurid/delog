// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';

    import Deon from '@plurid/deon';

    import {
        DelogContext,
        DelogInputRecordContext,
    } from '@plurid/delog';
    // #endregion libraries


    // #region external
    import {
        LoggedRecord,
        Tester as ITester,
        TesterConfiguration,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const parseConfiguration = async (
    data: string,
) => {
    try {
        const deon = new Deon();

        const parsedData: TesterConfiguration = await deon.parse(data);

        return parsedData;
    } catch (error) {
        try {
            const parsedData: TesterConfiguration = JSON.parse(data);

            return parsedData;
        } catch (error) {
            return;
        }
    }
}


const handleTester = async (
    tester: ITester,
    context: DelogContext,
    log: LoggedRecord,
) => {
    const {
        sharedID,
        sharedOrder,
    } = context;

    if (
        !sharedID
        || typeof sharedOrder === 'undefined'
    ) {
        return;
    }


    const configuration = await parseConfiguration(
        tester.configuration,
    );

    if (!configuration) {
        return;
    }


    const {
        phases,
    } = configuration;

    const currentPhase = phases[sharedOrder];

    if (!currentPhase) {
        // log as error?
        return;
    }

    if (
        currentPhase.text === log.text
        // && currentPhase.level === log.level
    ) {
        const storedTest = await database.query(
            'test',
            'id',
            sharedID,
        );

        console.log('logText', log.text, sharedOrder);


        if (sharedOrder === 0) {
            // start the test

            const test = {
                id: uuid.generate(),
                start: Date.now(),
                sharedID,
            };
            console.log('test', test);
        }

        if (sharedOrder === phases.length) {
            // stop the test

            // determine if the test is passed or failed
        }

        // update the test
    }
}

export interface TesterCall {
    contact: number;
    data: ITester;
}


class Tester {
    private calls: Record<string, TesterCall> = {};
    private interval: number = 0;

    constructor(
    ) {
    }

    public async test(
        log: LoggedRecord,
    ) {
        const isTestingLog = this.checkTestingLog(
            log,
        );

        if (!isTestingLog) {
            return;
        }

        const ownedBy = log.ownedBy;
        const project = log.project as string;
        const suite = log.context?.suite as string;
        const scenario = log.context?.scenario as string;
        const sharedID = log.context?.sharedID as string;

        const called = this.calls[sharedID];

        if (!called) {
            // check if tests have a test with the sharedID
            const testInDatabase: any[] = await database.query(
                'tests',
                'id',
                sharedID,
            );

            if (testInDatabase[0]) {
                return;
            }

            const tester: ITester | undefined = await database.aggregate(
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

            if (!tester) {
                return;
            }

            const contact = this.setCall(
                sharedID,
                tester,
            );

            // const testStore = {
            //     id: sharedID,
            //     contact,
            // };

            // await database.store(
            //     'test',
            //     sharedID,
            //     testStore,
            // );
        }


        // the log is a testing log

        // get the tester for the log

        // check if testing has started

            // if not - start waiting based on the delay
            // get all the records based on the shared id
                // if the number of records equals the number of phases start comparing
                // else start retrying
                // at timeout fail the test




        // const testers: ITester[] = await database.query(
        //     'testers',
        //     'ownedBy',
        //     this.log.ownedBy,
        // );

        // for (const tester of testers) {
        //     if (
        //         tester.project === project
        //         && tester.suite === suite
        //         && tester.scenario === scenario
        //     ) {
        //         handleTester(
        //             tester,
        //             context,
        //             log,
        //         );
        //     }
        // }
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

    private runner() {
        if (this.interval) {
            return;
        }

        this.interval = setInterval(
            () => {
                this.runLoop();
            },
            1000,
        );
    }

    private runLoop() {
        const now = Date.now();

        for (const [id, time] of Object.entries(this.calls)) {
            // check if time is in the past above the threshold
        }
    }

    private setCall(
        id: string,
        data: ITester,
    ) {
        const contact = Date.now();

        this.calls[id] = {
            contact,
            data,
        };

        return contact;
    }

    private unsetCall(
        id: string,
    ) {
        delete this.calls[id];
    }
}
// #endregion module



// #region exports
export default Tester;
// #endregion exports
