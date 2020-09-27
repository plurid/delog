// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Record,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerRecord = async (
    data: any,
) => {
    const id = uuid.generate();

    const record: Record = {
        id,
        ownedBy: '',
        ...data,
    };

    await database.store(
        'records',
        id,
        record,
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
// #endregion module



// #region exports
export {
    registerRecord,
    deregisterRecord,
};
// #endregion exports
