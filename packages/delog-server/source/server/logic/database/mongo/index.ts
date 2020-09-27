// #region imports
    // #region libraries
    import {
        MongoClient,
    } from 'mongodb';
    // #endregion libraries


    // #region external
    import {
        Database,
        DatabaseInitialize,
        DatabaseGet,
        DatabaseGetAll,
        DatabaseQuery,
        DatabaseStore,
        DatabaseUpdate,
        DatabaseObliterate,
        DatabaseObliterateAll,
    } from '#server/data/interfaces';

    import {
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_ADDRESS,
    } from '#server/data/constants';
    // #endregion external
// #endregion imports



// #region module
let connection: MongoClient | undefined;

const mongoNoConnectionError = 'Delog Error :: No mongo connection.';


const createConnection = async () => {
    try {
        const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_ADDRESS}`;

        const connection = await MongoClient.connect(
            uri,
        );

        return connection;
    } catch (error) {
        return;
    }
}


const initialize: DatabaseInitialize = async () => {
    connection = await createConnection();
    return true;
}


const get: DatabaseGet = async (
    entity,
    id,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return;
    }

    return;
}


const getAll: DatabaseGetAll = async (
    entity,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return [];
    }

    return [];
}


const query: DatabaseQuery = async (
    entity,
    field,
    value,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return;
    }

    return;
}


const store: DatabaseStore = async (
    entity,
    id,
    data,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return;
    }

    return;
}


const update: DatabaseUpdate = async (
    entity,
    id,
    field,
    value,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return;
    }

    return;
}


const obliterate: DatabaseObliterate = async (
    entity,
    id,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return;
    }

    return;
}


const obliterateAll: DatabaseObliterateAll = async (
    entity,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return;
    }

    return;
}



const mongoDatabase: Database = {
    initialize,
    get,
    getAll,
    query,
    store,
    update,
    obliterate,
    obliterateAll,
};
// #endregion module



// #region exports
export default mongoDatabase;
// #endregion exports
