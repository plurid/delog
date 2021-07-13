// #region imports
    // #region external
    import {
        RequiredDelogData,
        DelogContext,
    } from '#data/interfaces';

    import {
        GROUND_LEVEL,

        FORMAT,

        ENDPOINT,
        TOKEN,

        PROJECT,
        SPACE,

        CONSOLE_FALLBACK,
    } from '../general';

    import {
        delogLevels
    } from '../levels';

    import {
        now,
    } from '#services/utilities/time';
    // #endregion external
// #endregion imports



// #region module
const defaultContext: DelogContext = {
    mode: 'LOGGING',
    scenario: '',
    suite: '',
    sharedID: '',
    sharedOrder: -1,
};


const defaultConfiguration: RequiredDelogData = {
    text: '',
    time: now(),
    level: delogLevels.info,

    groundLevel: GROUND_LEVEL,

    endpoint: ENDPOINT,
    token: TOKEN,

    format: FORMAT,

    project: PROJECT,
    space: SPACE,

    consoleFallback: CONSOLE_FALLBACK,
};


const DEFAULT_CALL_DEPTH = 7;
// #endregion module



// #region exports
export {
    defaultConfiguration,
    defaultContext,

    DEFAULT_CALL_DEPTH,
};
// #endregion exports
