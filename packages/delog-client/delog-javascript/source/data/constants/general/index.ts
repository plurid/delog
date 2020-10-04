// #region imports
    // #region external
    import {
        delogLevels,
    } from '../levels';
    // #endregion external
// #endregion imports



// #region module
const GROUND_LEVEL = parseInt(process.env.DELOG_GROUND_LEVEL || '') || delogLevels.all;

const FORMAT = process.env.DELOG_FORMAT || '%TIME %SPACE %LEVEL %TEXT';

const ENDPOINT = process.env.DELOG_ENDPOINT || '';
const TOKEN = process.env.DELOG_TOKEN || '';

const PROJECT = process.env.DELOG_PROJECT || '';
const SPACE = process.env.DELOG_SPACE || '';
// #endregion module



// #region exports
export {
    GROUND_LEVEL,

    FORMAT,

    ENDPOINT,
    TOKEN,

    PROJECT,
    SPACE,
};
// #endregion exports
