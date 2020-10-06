// #region imports
    // #region external
    import {
        InputGetAnalyticsLastPeriod,
    } from '#server/data/interfaces';

    import {
        logLevels,
    } from '#server/data/constants';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const resolvePeriod = (
    value: string,
) => {
    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);
    const lastHourValue = Math.floor(lastHour.getTime() / 1000);

    return lastHourValue;
}

const resolveLevel = (
    kind: string,
): number => {
    return logLevels[kind] || logLevels.info;
}

const getRecordCount = async (
    input: any,
    kind: string,
) => {
    const {
        period,
        project,
        ownedBy,
    } = input;

    const periodValue = resolvePeriod(period);
    const level = resolveLevel(kind);

    const match = {
        time: { $gt: periodValue },
        level,
        project,
        ownedBy,
    };

    if (project === 'all projects') {
        delete match.project;
    }

    const pipeline = [
        {
            $match: match,
        },
        {
            $count: 'data',
        },
    ];

    const value = await database.aggregate(
        'records',
        pipeline,
    );

    if (!value[0]) {
        return 0;
    }

    const {
        data,
    } = value[0];

    return data;
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
