// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Space,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerSpace = async (
    name: string,
) => {
    const id = uuid.generate();

    const space: Space = {
        id,
        name,
        ownedBy: '',
    };

    await database.store(
        'space',
        id,
        space,
    );

    return space;
}


const deregisterSpace = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'space',
            id,
        );
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    registerSpace,
    deregisterSpace,
};
// #endregion exports
