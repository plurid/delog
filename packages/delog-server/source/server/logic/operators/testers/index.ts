// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Tester,
        InputGenerateTester,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerTester = async (
    data: InputGenerateTester,
    ownedBy: string,
) => {
    const id = data.id || uuid.generate();

    const tester: Tester = {
        ...data as any,
        id,
        ownedBy,
    };

    await database.store(
        'testers',
        id,
        tester,
    );

    return tester;
}


const deregisterTester = async (
    id: string,
    ownedBy: string,
) => {
    try {
        await database.obliterate(
            'testers',
            {
                id,
                ownedBy,
            },
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
