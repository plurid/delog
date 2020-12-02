// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputQuery,
    } from '~server/data/interfaces';

    import {
        Records,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getRecords: (
        _: any,
        { input }: InputOf<InputQuery | undefined>,
        context: Context,
    ) => Records.Query.getRecords(
        input,
        context,
    ),
};
// #endregion exports
