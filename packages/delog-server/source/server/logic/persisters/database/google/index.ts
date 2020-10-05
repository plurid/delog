// #region imports
    // #region external
    import {
        Database,
        DatabaseInitialize,
        DatabaseGet,
        DatabaseGetAll,
        DatabaseQuery,
        DatabaseStore,
        DatabaseStoreBatch,
        DatabaseUpdate,
        DatabaseObliterate,
        DatabaseObliterateAll,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const initialize: DatabaseInitialize = async () => {
    return true;
}


const get: DatabaseGet = async (
    entity,
    id,
) => {
    return;
}


const getAll: DatabaseGetAll = async (
    entity,
) => {
    return [];
}


const query: DatabaseQuery = async (
    entity,
    field,
    value,
) => {
    return;
}


const store: DatabaseStore = async (
    entity,
    id,
    data,
) => {
    return;
}


const storeBatch: DatabaseStoreBatch = async (
    entity,
    data,
) => {
    return;
}


const update: DatabaseUpdate = async (
    entity,
    id,
    field,
    value,
) => {
    return;
}


const obliterate: DatabaseObliterate = async (
    entity,
    id,
) => {
    return;
}


const obliterateAll: DatabaseObliterateAll = async (
    entity,
) => {
    return;
}



const googleDatabase: Database = {
    initialize,
    get,
    getAll,
    query,
    store,
    storeBatch,
    update,
    obliterate,
    obliterateAll,
};
// #endregion module



// #region exports
export default googleDatabase;
// #endregion exports
