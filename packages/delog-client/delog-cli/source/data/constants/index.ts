// #region imports
    // #region libraries
    import os from 'os';
    import path from 'path';
    // #endregion libraries


    // #region external
    import {
        Configuration,
        ConfigurationDefaults,
    } from '../interfaces';
    // #endregion external
// #endregion imports



// #region module
const homeDirectory = os.homedir();

const DELOG_CONFIGURATION_FILE = '.delog.config.deon';
const delogConfigurationPath = path.join(
    homeDirectory,
    DELOG_CONFIGURATION_FILE
);


const DELOG_COOKIE = 'PVTTKN';


const configurationDefaults: ConfigurationDefaults = {
    format: '%TIME %TEXT',
};


const defaultConfiguration: Configuration = {
    identonym: '',
    key: '',
    server: '',
    token: '',
    isDefault: false,
    defaults: {
        ...configurationDefaults,
    },
};


const LOG_LEVEL_FATAL = 6;
const LOG_LEVEL_ERROR = 5;
const LOG_LEVEL_WARN = 4;
const LOG_LEVEL_INFO = 3;
const LOG_LEVEL_DEBUG = 2;
const LOG_LEVEL_TRACE = 1;

const logLevels = {
    fatal: LOG_LEVEL_FATAL,
    error: LOG_LEVEL_ERROR,
    warn: LOG_LEVEL_WARN,
    info: LOG_LEVEL_INFO,
    debug: LOG_LEVEL_DEBUG,
    trace: LOG_LEVEL_TRACE,
};
// #endregion module



// #region exports
export {
    homeDirectory,

    DELOG_CONFIGURATION_FILE,
    delogConfigurationPath,

    DELOG_COOKIE,

    configurationDefaults,
    defaultConfiguration,

    logLevels,
};
// #endregion exports
