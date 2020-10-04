// #region imports
    // #region external
    import {
        DelogLevels,
    } from '#data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const DELOG_LEVEL_NONE = 7;
export const DELOG_LEVEL_FATAL = 6;
export const DELOG_LEVEL_ERROR = 5;
export const DELOG_LEVEL_WARN = 4;
export const DELOG_LEVEL_INFO = 3;
export const DELOG_LEVEL_DEBUG = 2;
export const DELOG_LEVEL_TRACE = 1;
export const DELOG_LEVEL_ALL = 0;

export const delogLevels: DelogLevels = {
    none: DELOG_LEVEL_NONE,
    fatal: DELOG_LEVEL_FATAL,
    error: DELOG_LEVEL_ERROR,
    warn: DELOG_LEVEL_WARN,
    info: DELOG_LEVEL_INFO,
    debug: DELOG_LEVEL_DEBUG,
    trace: DELOG_LEVEL_TRACE,
    all: DELOG_LEVEL_ALL,
};
// #endregion module
