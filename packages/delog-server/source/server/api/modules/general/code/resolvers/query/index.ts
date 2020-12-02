// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputGetCode,
    } from '~server/data/interfaces';

    import {
        Code,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getCode: (
        _: any,
        { input }: InputOf<InputGetCode>,
        context: Context,
    ) => Code.Query.getCode(
        input,
        context,
    ),
};
// #endregion exports
