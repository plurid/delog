// #region imports
    // #region external
    import {
        Context,
    } from '~server/data/interfaces';

    import {
        Spaces,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    spaces: async (
        _: any,
        __: any,
        context: Context,
    ) => {
        const query = await Spaces.Query.getSpaces(
            context,
        );

        if (!query.status) {
            return [];
        }

        return query.data;
    },
};
// #endregion exports
