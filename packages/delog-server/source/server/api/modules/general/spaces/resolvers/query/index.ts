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
    getSpaces: (
        _: any,
        __: any,
        context: Context,
    ) => Spaces.Query.getSpaces(
        context,
    ),
};
// #endregion exports
