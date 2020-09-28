// #region imports
    // #region external
    import {
        Context,
    } from '#server/data/interfaces';

    import {
        Formats,
    } from '#server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    formats: async (
        _: any,
        __: any,
        context: Context,
    ) => {
        const query = await Formats.Query.getFormats(
            context,
        );

        if (!query.status) {
            return [];
        }

        return query.data;
    },
};
// #endregion exports
