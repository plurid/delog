// #region imports
    // #region libraries
    import {
        DelogInputLog,
    } from '@plurid/delog';
    // #endregion libraries


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
        { input }: InputOf<DelogInputLog>,
        context: Context,
    ) => Records.Mutation.log(
        input,
        context,
    ),
};
// #endregion exports
