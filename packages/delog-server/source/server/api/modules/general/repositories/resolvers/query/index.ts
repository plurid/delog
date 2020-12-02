// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputValueString,
    } from '~server/data/interfaces';

    import {
        Repositories,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getRepositories: (
        _: any,
        __: any,
        context: Context,
    ) => Repositories.Query.getRepositories(
        context,
    ),
    getProviderRepositories: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Repositories.Query.getProviderRepositories(
        input,
        context,
    ),
};
// #endregion exports
