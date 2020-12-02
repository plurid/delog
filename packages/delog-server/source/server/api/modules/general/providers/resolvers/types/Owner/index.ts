// #region imports
    // #region external
    import {
        Context,
    } from '~server/data/interfaces';

    import {
        Providers,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    providers: async (
        _: any,
        __: any,
        context: Context,
    ) => {
        const query = await Providers.Query.getProviders(
            context,
        );

        if (!query.status) {
            return [];
        }

        return query.data;
    },
};
// #endregion exports
