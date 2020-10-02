// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Record,
        LoggedRecord,
    } from '#server/data/interfaces';

    import database from '#server/services/database';

    import Formatter from '#server/objects/Formatter';
    // #endregion external
// #endregion imports



// #region module
const registerRecord = async (
    data: any,
) => {
    const id = uuid.generate();

    const record: Record = {
        id,
        ...data,
    };

    const formatter = new Formatter(record);

    const log = formatter.format();

    const loggedRecord: LoggedRecord = {
        ...record,
        log,
    };

    await database.store(
        'records',
        id,
        loggedRecord,
    );

    return record;
}


const deregisterRecord = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'records',
            id,
        );
    } catch (error) {
        return;
    }
}


const deregisterRecords = async (
    ownedBy: string,
    filter?: string,
) => {
    try {
        if (!filter) {
            await database.obliterateAll(
                'records',
                {
                    ownedBy,
                },
            );
        }

        // remove based on filter
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    registerRecord,
    deregisterRecord,
    deregisterRecords,
};
// #endregion exports
