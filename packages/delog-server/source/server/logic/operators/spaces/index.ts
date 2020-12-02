// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Space,
        InputGenerateSpace,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerSpace = async (
    input: InputGenerateSpace,
    ownedBy: string,
) => {
    const {
        name,
        project,
    } = input;

    const id = uuid.generate();

    const space: Space = {
        id,
        name,
        project,
        ownedBy,
    };

    await database.store(
        'spaces',
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
            'spaces',
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
    registerSpace,
    deregisterSpace,
};
// #endregion exports
