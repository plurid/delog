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
    groundLevel: GROUND_LEVEL,

    format: FORMAT,

    endpoint: ENDPOINT,
    token: TOKEN,

    project: PROJECT,
    space: SPACE,

    level: delogLevels.info,
    method: '',
    error: '',
    extradata: '',

    context: {
        ...defaultContext,
    },

    text: '',

    time: now(),
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
