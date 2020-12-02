// #region imports
    // #region external
    import {
        Context,
    } from '~server/data/interfaces';

    import {
        Notifiers,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    notifiers: async (
        _: any,
        __: any,
        context: Context,
    ) => {
        const query = await Notifiers.Query.getNotifiers(
            context,
        );

        if (!query.status) {
            return [];
        }

        return query.data;
    },
};
// #endregion exports
