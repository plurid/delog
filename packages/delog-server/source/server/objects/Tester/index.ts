// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';

    import Deon from '@plurid/deon';

    import {
        DelogContext,
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


class Tester {
    private calls: Record<string, number> = {};

    constructor(
    ) {
    }

    public async test(
        log: LoggedRecord,
    ) {
        const {
            context,
            project,
        } = log;

        if (!context) {
            return;
        }

        const {
            mode,
            suite,
            scenario,
            sharedID,
            sharedOrder,
        } = context;

        if (mode !== 'TESTING') {
            return
        }

        if (
            !project
            || !suite
            || !scenario
            || !sharedID
            || typeof sharedOrder === 'undefined'
        ) {
            return;
        }

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

            const contact = this.setCall(sharedID);

            const testStore = {
                id: sharedID,
                contact,
            };

            await database.store(
                'test',
                sharedID,
                testStore,
            );
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


    private setCall(
        id: string,
    ) {
        const now = Date.now();

        this.calls[id] = now;

        return now;
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
