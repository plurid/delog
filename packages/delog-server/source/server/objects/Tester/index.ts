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
    private log: LoggedRecord;

    constructor(
        log: LoggedRecord,
    ) {
        this.log = log;
    }

    public async test() {
        const {
            context,
            project,
        } = this.log;

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

        const testers: ITester[] = await database.query(
            'testers',
            'ownedBy',
            this.log.ownedBy,
        );

        for (const tester of testers) {
            if (
                tester.project === project
                && tester.suite === suite
                && tester.scenario === scenario
            ) {
                handleTester(
                    tester,
                    context,
                    this.log,
                );
            }
        }
    }
}
// #endregion module



// #region exports
export default Tester;
// #endregion exports
