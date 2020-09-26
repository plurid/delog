// #region imports
    // #region external
    import {
        Context,
        InputOf,
    } from '#server/data/interfaces';

    import {
        Records,
    } from '#server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    delogMutationLog: (
        _: any,
        { input }: InputOf<any>,
        context: Context,
    ) => Records.Mutation.log(
        input,
        context,
    ),
};
// #endregion exports
