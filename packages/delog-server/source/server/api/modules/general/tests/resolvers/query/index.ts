// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputQuery,
    } from '~server/data/interfaces';

    import {
        Tests,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getTests: (
        _: any,
        { input }: InputOf<InputQuery | undefined>,
        context: Context,
    ) => Tests.Query.getTests(
        input,
        context,
    ),
};
// #endregion exports
