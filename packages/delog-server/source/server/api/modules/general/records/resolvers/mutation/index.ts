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
        InputValueString,
        InputClearRecords,
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
    obliterateRecord: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Records.Mutation.obliterateRecord(
        input,
        context,
    ),
    clearRecords: (
        _: any,
        { input }: InputOf<InputClearRecords>,
        context: Context,
    ) => Records.Mutation.clearRecords(
        input,
        context,
    ),
};
// #endregion exports
