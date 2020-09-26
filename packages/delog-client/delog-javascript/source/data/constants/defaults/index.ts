// #region imports
    // #region external
    import {
        RequiredDelogData,
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
        logLevels
    } from '../levels';

    import {
        now,
    } from '#services/utilities';
    // #endregion external
// #endregion imports



// #region module
const defaultConfiguration: RequiredDelogData = {
    groundLevel: GROUND_LEVEL,

    format: FORMAT || '',

    endpoint: ENDPOINT || '',
    token: TOKEN || '',

    project: PROJECT || '',
    space: SPACE || '',

    level: logLevels.info,
    method: '',
    sharedID: '',
    error: '',
    extradata: '',

    text: '',

    time: now(),
};
// #endregion module



// #region exports
export {
    defaultConfiguration,
};
// #endregion exports
