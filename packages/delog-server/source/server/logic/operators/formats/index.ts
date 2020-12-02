// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Format,
        InputGenerateFormat,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerFormat = async (
    input: InputGenerateFormat,
    ownedBy: string,
) => {
    const {
        identifier,
        transform,
    } = input;

    const id = uuid.generate();

    const format: Format = {
        id,
        identifier,
        transform,
        ownedBy,
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
            {
                id,
            },
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
