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


const CALL_CONTEXT = process.env.DELOG_CALL_CONTEXT === 'true';
const CODE_PROVIDER = process.env.DELOG_CODE_PROVIDER || '';
const REPOSITORY_NAME = process.env.DELOG_REPOSITORY_NAME || '';
const REPOSITORY_BASEPATH = process.env.DELOG_REPOSITORY_BASEPATH || '';
// #endregion module



// #region exports
export {
    GROUND_LEVEL,

    FORMAT,

    ENDPOINT,
    TOKEN,

    PROJECT,
    SPACE,

    CALL_CONTEXT,
    CODE_PROVIDER,
    REPOSITORY_NAME,
    REPOSITORY_BASEPATH,
};
// #endregion exports
