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
const getRecordCount = async (
    input: any,
    kind: string,
) => {
    const {
        period,
        project,
        ownedBy,
    } = input;

    const values = await database.aggregate(
        'records',
    );
    // console.log('values', values);

    return 0;
}


const analyticsLastPeriod = async (
    input: InputGetAnalyticsLastPeriod,
    ownedBy: string,
) => {
    const {
        period,
        project,
        type
    } = input;

    const recordInput = {
        period,
        project,
        ownedBy,
    };

    switch (type) {
        case 'entries': {
            const fatal = await getRecordCount(recordInput, 'fatal');
            const error = await getRecordCount(recordInput, 'error');
            const warn = await getRecordCount(recordInput, 'warn');
            const info = await getRecordCount(recordInput, 'info');
            const debug = await getRecordCount(recordInput, 'debug');
            const trace = await getRecordCount(recordInput, 'trace');

            return {
                fatal,
                error,
                warn,
                info,
                debug,
                trace,
            };
        }
        case 'faults': {
            const fatal = await getRecordCount(recordInput, 'fatal');
            const error = await getRecordCount(recordInput, 'error');
            const warn = await getRecordCount(recordInput, 'warn');

            return {
                fatal,
                error,
                warn,
            };
        }
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
