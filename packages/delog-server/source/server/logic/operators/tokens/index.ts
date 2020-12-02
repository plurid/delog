// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Token,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerToken = async (
    name: string,
    ownedBy: string,
) => {
    const id = uuid.generate();
    const value = uuid.generate() + uuid.generate();
    const startsWith = value.slice(0, 7);

    const token: Token = {
        id,
        name,
        value,
        ownedBy,
        startsWith,
    };

    await database.store(
        'tokens',
        id,
        token,
    );

    return token;
}


const deregisterToken = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'tokens',
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
    registerToken,
    deregisterToken,
};
// #endregion exports
