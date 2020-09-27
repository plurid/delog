// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Format,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerFormat = async (
    value: string,
) => {
    const id = uuid.generate();

    const format: Format = {
        id,
        value,
        ownedBy: '',
    };

    await database.store(
        'formats',
        id,
        format,
    );

    return format;
}


const deregisterFormat = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'formats',
            id,
        );
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    registerFormat,
    deregisterFormat,
};
// #endregion exports
