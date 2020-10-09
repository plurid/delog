// #region imports
    // #region libraries
    import Deon from '@plurid/deon';
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


class Tester {
    private log: LoggedRecord;

    constructor(
        log: LoggedRecord,
    ) {
        this.log = log;
    }

    public async test() {
        if (this.log.context?.mode !== 'TESTING') {
            return;
        }

        const {
            scenario,
            suite,
        } = this.log.context;

        if (!scenario || !suite) {
            return;
        }

        // get the appropriate tester
        // check if the log triggers any tester

        const testers: ITester[] = await database.query(
            'testers',
            'ownedBy',
            this.log.ownedBy,
        );

        for (const tester of testers) {
            if (
                tester.scenario === scenario
                && tester.suite === suite
            ) {
                // read the configuration
                const configuration = await parseConfiguration(
                    tester.configuration,
                );

                if (!configuration) {
                    continue;
                }

                // checck if it matches the first stage

                // trigger the test

                // register the test as triggered

                // check if test is triggered

                // check if test ends

                // pass or fail the test
            }
        }
    }
}
// #endregion module



// #region exports
export default Tester;
// #endregion exports
