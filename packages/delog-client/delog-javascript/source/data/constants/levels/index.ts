// #region imports
    // #region external
    import {
        DelogLevels,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const DELOG_GROUND_LEVEL_NONE = 7;
export const DELOG_GROUND_LEVEL_ALL = 0;

export const DELOG_LEVEL_FATAL = 6;
export const DELOG_LEVEL_ERROR = 5;
export const DELOG_LEVEL_WARN = 4;
export const DELOG_LEVEL_INFO = 3;
export const DELOG_LEVEL_DEBUG = 2;
export const DELOG_LEVEL_TRACE = 1;

export const delogLevels: DelogLevels = {
    fatal: DELOG_LEVEL_FATAL,
    error: DELOG_LEVEL_ERROR,
    warn: DELOG_LEVEL_WARN,
    info: DELOG_LEVEL_INFO,
    debug: DELOG_LEVEL_DEBUG,
    trace: DELOG_LEVEL_TRACE,
};


export const delogLevelsText = {
    6: 'fatal',
    5: 'error',
    4: 'warn',
    3: 'info',
    2: 'debug',
    1: 'trace',
};
// #endregion module
