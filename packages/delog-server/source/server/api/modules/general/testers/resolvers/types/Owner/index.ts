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
    testers: async (
        _: any,
        __: any,
        context: Context,
    ) => {
        const query = await Testers.Query.getTesters(
            context,
        );

        if (!query.status) {
            return [];
        }

        return query.data;
    },
};
// #endregion exports
