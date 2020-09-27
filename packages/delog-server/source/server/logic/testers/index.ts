// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Tester,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerTester = async (
    name: string,
) => {
    const id = uuid.generate();

    const space: Tester = {
        id,
    };

    await database.store(
        'space',
        id,
        space,
    );

    return space;
}


const deregisterTester = async (
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
    registerTester,
    deregisterTester,
};
// #endregion exports
