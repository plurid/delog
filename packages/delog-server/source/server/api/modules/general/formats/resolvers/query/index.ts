// #region imports
    // #region external
    import {
        Context,
    } from '~server/data/interfaces';

    import {
        Formats,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getFormats: (
        _: any,
        __: any,
        context: Context,
    ) => Formats.Query.getFormats(
        context,
    ),
};
// #endregion exports
