// #region imports
    // #region external
    import {
        DELOG_GROUND_LEVEL_ALL,
    } from '../levels';
    // #endregion external
// #endregion imports



// #region module
const CONSOLE_FALLBACK = process.env.DELOG_CONSOLE_FALLBACK === 'true';

const QUIET = process.env.DELOG_QUIET === 'true';

const GROUND_LEVEL = parseInt(process.env.DELOG_GROUND_LEVEL || '') || DELOG_GROUND_LEVEL_ALL;

const FORMAT = process.env.DELOG_FORMAT || '';

const ENDPOINT = process.env.DELOG_ENDPOINT || '';
const TOKEN = process.env.DELOG_TOKEN || '';

const PROJECT = process.env.DELOG_PROJECT || '';
const SPACE = process.env.DELOG_SPACE || '';


const CALL_CONTEXT = process.env.DELOG_CALL_CONTEXT === 'true';
const REPOSITORY_PROVIDER = process.env.DELOG_REPOSITORY_PROVIDER || '';
const REPOSITORY_NAME = process.env.DELOG_REPOSITORY_NAME || '';
const REPOSITORY_COMMIT = process.env.DELOG_REPOSITORY_COMMIT || 'latest';
const REPOSITORY_BRANCH = process.env.DELOG_REPOSITORY_BRANCH || 'master';
const REPOSITORY_BASEPATH = process.env.DELOG_REPOSITORY_BASEPATH || '__MATCH_CUT__';
// #endregion module



// #region exports
export {
    CONSOLE_FALLBACK,

    QUIET,

    GROUND_LEVEL,

    FORMAT,

    ENDPOINT,
    TOKEN,

    PROJECT,
    SPACE,

    CALL_CONTEXT,
    REPOSITORY_PROVIDER,
    REPOSITORY_BRANCH,
    REPOSITORY_COMMIT,
    REPOSITORY_NAME,
    REPOSITORY_BASEPATH,
};
// #endregion exports
