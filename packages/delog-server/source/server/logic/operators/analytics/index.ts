// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        InputGetAnalyticsLastPeriod,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const analyticsLastPeriod = async (
    input: InputGetAnalyticsLastPeriod,
    ownedBy: string,
) => {
    const {
        project,
        period,
        type
    } = input;


    switch (type) {
        case 'entries':
            return {
                fatal: 0,
                error: 0,
                warn: 0,
                info: 0,
                debug: 0,
                trace: 0,
            };
        case 'faults':
            return {
                fatal: 0,
                error: 0,
                warn: 0,
            };
        default:
            return {
                fatal: 0,
                error: 0,
                warn: 0,
                info: 0,
                debug: 0,
                trace: 0,
            };
    }
}
// #endregion module



// #region exports
export {
    analyticsLastPeriod,
};
// #endregion exports
