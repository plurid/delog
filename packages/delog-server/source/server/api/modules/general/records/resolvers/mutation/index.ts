// #region imports
    // #region libraries
    import {
        DelogInputRecord,
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
    delogMutationRecord: (
        _: any,
        { input }: InputOf<DelogInputRecord>,
        context: Context,
    ) => Records.Mutation.record(
        input,
        context,
    ),
};
// #endregion exports
