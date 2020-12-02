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
    tokens: async (
        _: any,
        __: any,
        context: Context,
    ) => {
        const query = await Tokens.Query.getTokens(
            context,
        );

        if (!query.status) {
            return [];
        }

        return query.data;
    },
};
// #endregion exports
