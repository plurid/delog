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
    getNotifiers: (
        _: any,
        __: any,
        context: Context,
    ) => Notifiers.Query.getNotifiers(
        context,
    ),
};
// #endregion exports
