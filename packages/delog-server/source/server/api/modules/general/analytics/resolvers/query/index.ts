// #region imports
    // #region external
    import {
        InputOf,
        InputGetAnalyticsLastPeriod,
        InputGetAnalyticsSize,
        Context,
    } from '~server/data/interfaces';

    import {
        Analytics,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    getAnalyticsLastPeriod: (
        _: any,
        { input }: InputOf<InputGetAnalyticsLastPeriod>,
        context: Context,
    ) => Analytics.Query.getAnalyticsLastPeriod(
        input,
        context,
    ),
    getAnalyticsSize: (
        _: any,
        { input }: InputOf<InputGetAnalyticsSize>,
        context: Context,
    ) => Analytics.Query.getAnalyticsSize(
        input,
        context,
    ),
};
// #endregion exports
