// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputAddProvider,
        InputValueString,
    } from '~server/data/interfaces';

    import {
        Providers,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    addProvider: (
        _: any,
        { input }: InputOf<InputAddProvider>,
        context: Context,
    ) => Providers.Mutation.addProvider(
        input,
        context,
    ),
    obliterateProvider: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Providers.Mutation.obliterateProvider(
        input,
        context,
    ),
};
// #endregion exports
