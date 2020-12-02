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
        InputObliterateRecords,
    } from '~server/data/interfaces';

    import {
        Records,
    } from '~server/api/models';
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
    obliterateRecords: (
        _: any,
        { input }: InputOf<InputObliterateRecords>,
        context: Context,
    ) => Records.Mutation.obliterateRecords(
        input,
        context,
    ),
};
// #endregion exports
