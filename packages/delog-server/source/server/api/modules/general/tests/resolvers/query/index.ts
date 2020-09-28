// #region imports
    // #region external
    import {
        Context,
    } from '#server/data/interfaces';

    import {
        Tests,
    } from '#server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getTests: (
        _: any,
        __: any,
        context: Context,
    ) => Tests.Query.getTests(
        context,
    ),
};
// #endregion exports
