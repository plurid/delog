// #region imports
    // #region external
    import {
        Context,
    } from '#server/data/interfaces';

    import {
        Records,
    } from '#server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getRecords: (
        _: any,
        __: any,
        context: Context,
    ) => Records.Query.getRecords(
        context,
    ),
};
// #endregion exports
