// #region imports
    // #region external
    import {
        Context,
    } from '~server/data/interfaces';

    import {
        Testers,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getTesters: (
        _: any,
        __: any,
        context: Context,
    ) => Testers.Query.getTesters(
        context,
    ),
};
// #endregion exports
