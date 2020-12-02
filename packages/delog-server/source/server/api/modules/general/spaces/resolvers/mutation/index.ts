// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputValueString,
        InputGenerateSpace,
    } from '~server/data/interfaces';

    import {
        Spaces,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    generateSpace: (
        _: any,
        { input }: InputOf<InputGenerateSpace>,
        context: Context,
    ) => Spaces.Mutation.generateSpace(
        input,
        context,
    ),
    obliterateSpace: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Spaces.Mutation.obliterateSpace(
        input,
        context,
    ),
};
// #endregion exports
