// #region imports
    // #region external
    import {
        Context,
    } from '~server/data/interfaces';

    import {
        Tokens,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getTokens: (
        _: any,
        __: any,
        context: Context,
    ) => Tokens.Query.getTokens(
        context,
    ),
};
// #endregion exports
