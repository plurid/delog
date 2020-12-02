// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputGetAnalyticsLastPeriodData,
        InputGetAnalyticsSize,
    } from '~server/data/interfaces';

    import {
        Analytics,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    entries: async (
        _: any,
        { input }: Partial<InputOf<InputGetAnalyticsLastPeriodData>>,
        context: Context,
    ) => {
        const project = input?.project || 'all projects';
        const period = input?.period || 'hour';

        const entriesInput = {
            project,
            period,
            type: 'entries',
        };

        const entriesQuery = await Analytics.Query.getAnalyticsLastPeriod(
            entriesInput,
            context,
        );

        if (!entriesQuery.data) {
            return {
                project,
                period,
                data: [],
            };
        }

        const entriesData = Object.entries(entriesQuery.data).map(([key, value]) => {
            return {
                name: key,
                value,
            };
        });

        return {
            project,
            period,
            data: [
                ...entriesData,
            ],
        };
    },
    faults: async (
        _: any,
        { input }: Partial<InputOf<InputGetAnalyticsLastPeriodData>>,
        context: Context,
    ) => {
        const project = input?.project || 'all projects';
        const period = input?.period || 'hour';

        const faultsInput = {
            project,
            period,
            type: 'faults',
        };

        const faultsQuery = await Analytics.Query.getAnalyticsLastPeriod(
            faultsInput,
            context,
        );

        if (!faultsQuery.data) {
            return {
                project,
                period,
                data: [],
            };
        }

        const faultsData = Object.entries(faultsQuery.data).map(([key, value]) => {
            return {
                name: key,
                value,
            };
        });

        return {
            project,
            period,
            data: [
                ...faultsData,
            ],
        };
    },
    size: async (
        _: any,
        { input }: Partial<InputOf<InputGetAnalyticsSize>>,
        context: Context,
    ) => {
        const project = input?.project || 'all projects';

        const queryInput = {
            project,
        };

        const query = await Analytics.Query.getAnalyticsSize(
            queryInput,
            context,
        );

        if (!query.data) {
            return {
                project,
                value: 0,
            };
        }

        return {
            ...query.data,
        };
    },
};
// #endregion exports
