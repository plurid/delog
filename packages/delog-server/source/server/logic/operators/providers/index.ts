// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Provider,
        InputAddProvider,
        InputValueString,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerProvider = async (
    input: InputAddProvider,
) => {
    const {
        type,
        token,
        name,
    } = input;

    const id = uuid.generate();

    const provider: Provider = {
        id,
        type,
        token,
        name,
    };

    await database.store(
        'provider',
        id,
        provider,
    );

    return provider;
}


const deregisterProvider = async (
    input: InputValueString,
) => {
    await database.obliterate(
        'provider',
        input.value,
    );
}
// #endregion module



// #region exports
export {
    registerProvider,
    deregisterProvider,
};
// #endregion exports
