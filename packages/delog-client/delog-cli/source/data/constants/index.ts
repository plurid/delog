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
// #endregion module



// #region exports
export {
    homeDirectory,

    DELOG_CONFIGURATION_FILE,
    delogConfigurationPath,

    DELOG_COOKIE,

    configurationDefaults,
    defaultConfiguration,
};
// #endregion exports
