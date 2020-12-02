// #region imports
    // #region external
    import {
        LoggedRecord,
    } from '~server/data/interfaces';

    import {
        DATABASE_TYPE,
    } from '~server/data/constants';

    import Database from '~server/logic/persisters/database';

    import Batcher from '~server/objects/Batcher';
    // #endregion external
// #endregion imports



// #region module
const database = new Database(DATABASE_TYPE);


const recordsBatcher = new Batcher<LoggedRecord>(
    'records',
    database,
);
// #endregion module



// #region exports
export default recordsBatcher;
// #endregion exports
