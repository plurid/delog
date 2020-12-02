// #region imports
    // #region external
    import {
        InputGetAnalyticsLastPeriod,
        InputGetAnalyticsSize,
    } from '~server/data/interfaces';

    import {
        logLevels,
    } from '~server/data/constants';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const resolvePeriod = (
    value: string,
) => {
    const time = Math.floor(Date.now() / 1000);
    const SECONDS_IN_HOUR = 3_600;
    const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;

    switch (value) {
        case 'hour':
            return time - SECONDS_IN_HOUR;
        case '24 hours':
            return time - SECONDS_IN_DAY;
        case '7 days':
            return time - (SECONDS_IN_DAY * 7);
        case '30 days':
            return time - (SECONDS_IN_DAY * 30);
        default:
            return time - SECONDS_IN_HOUR;
    }
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
                info: 0,
                debug: 0,
                trace: 0,
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


const analyticsSize = async (
    input: InputGetAnalyticsSize,
    ownedBy: string,
) => {
    const {
        project,
    } = input;

    const filter = {
        project,
        ownedBy,
    };

    if (project === 'all projects') {
        delete (filter as any).project;
    }

    const size = await database.size(
        'records',
        filter,
    );

    return {
        project,
        value: size,
    };
}
// #endregion module



// #region exports
export {
    analyticsLastPeriod,
    analyticsSize,
};
// #endregion exports
