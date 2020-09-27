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

const DATABASE = 'delog';


const createConnection = async () => {
    try {
        const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_ADDRESS}`;

        const connection = await MongoClient.connect(
            uri,
            {
                useUnifiedTopology: true,
            },
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

    try {
        const database = connection.db(DATABASE);

        const collection = database.collection(entity);

        return;
    } catch (error) {
        return;
    }
}


const getAll: DatabaseGetAll = async (
    entity,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return [];
    }

    try {
        const database = connection.db(DATABASE);

        const collection = database.collection(entity);

        return [];
    } catch (error) {
        return [];
    }
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

    try {
        const database = connection.db(DATABASE);

        const collection = database.collection(entity);

        return true;
    } catch (error) {
        return false;
    }
}


const store: DatabaseStore = async (
    entity,
    id,
    data,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return false;
    }

    try {
        const database = connection.db(DATABASE);

        const collection = database.collection(entity);

        await collection.insertOne(
            data,
        );

        return true;
    } catch (error) {
        return false;
    }
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

    try {
        const database = connection.db(DATABASE);

        const collection = database.collection(entity);

        return true;
    } catch (error) {
        return false;
    }
}


const obliterate: DatabaseObliterate = async (
    entity,
    id,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return;
    }

    try {
        const database = connection.db(DATABASE);

        const collection = database.collection(entity);

        const deletion = await collection.deleteOne({
            id,
        });

        if (deletion.deletedCount !== 1) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}


const obliterateAll: DatabaseObliterateAll = async (
    entity,
) => {
    if (!connection) {
        console.log(mongoNoConnectionError);
        return;
    }

    try {
        const database = connection.db(DATABASE);

        const collection = database.collection(entity);

        return;
    } catch (error) {
        return;
    }
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
