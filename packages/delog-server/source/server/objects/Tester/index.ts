// #region imports
    // #region external
    import {
        LoggedRecord,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
class Tester {
    private log: LoggedRecord;

    constructor(
        log: LoggedRecord,
    ) {
        this.log = log;
    }

    public async test() {
        if (this.log.context.mode !== 'TESTING') {
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

        const testers = await database.query(
            'testers',
            'ownedBy',
            '',
        );
    }
}
// #endregion module



// #region exports
export default Tester;
// #endregion exports
