// #region imports
    // #region libraries
    import os from 'os';
    import path from 'path';
    // #endregion libraries
// #endregion imports



// #region module
const homeDirectory = os.homedir();

const DELOG_CONFIGURATION_FILE = '.delog.config.deon';
const delogConfigurationPath = path.join(
    homeDirectory,
    DELOG_CONFIGURATION_FILE
);

const DELOG_COOKIE = 'PVTTKN';
// #endregion module



// #region exports
export {
    homeDirectory,

    DELOG_CONFIGURATION_FILE,
    delogConfigurationPath,

    DELOG_COOKIE,
};
// #endregion exports
