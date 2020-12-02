// #region imports
    // #region external
    import {
        Context,
    } from '~server/data/interfaces';

    import {
        Repositories,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    repositories: async (
        _: any,
        __: any,
        context: Context,
    ) => {
        const query = await Repositories.Query.getRepositories(
            context,
        );

        if (!query.status) {
            return [];
        }

        return query.data;
    },
};
// #endregion exports
