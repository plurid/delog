// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Token,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerToken = async (
    value: string,
) => {
    const id = uuid.generate();

    const token: Token = {
        id,
        ownedBy: '',
        value,
    };

    await database.store(
        'token',
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
            'token',
            id,
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
