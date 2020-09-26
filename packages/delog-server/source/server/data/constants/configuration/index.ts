// #region imports
    // #region external
    import {
        DatabaseType,
        StorageType,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const DATABASE_TYPE = (process.env.DESERVE_DATABASE_TYPE as DatabaseType | undefined)
    || 'filesystem';

export const STORAGE_TYPE = (process.env.DESERVE_STORAGE_TYPE as StorageType | undefined)
    || 'filesystem';


export const LOG_LEVEL = process.env.DESERVE_LOG_LEVEL || '7';
export const QUIET = process.env.DESERVE_QUIET === 'true';

export const logLevel = QUIET
    ? 0
    : parseInt(LOG_LEVEL);


export const CUSTOM_LOGIC_USAGE = process.env.DESERVE_CUSTOM_LOGIC_USAGE === 'true';

export const PRIVATE_USAGE = process.env.DESERVE_PRIVATE_USAGE === 'true'
export const PRIVATE_OWNER_IDENTONYM = process.env.DESERVE_PRIVATE_OWNER_IDENTONYM || '';
export const PRIVATE_OWNER_KEY = process.env.DESERVE_PRIVATE_OWNER_KEY || '';
export const PRIVATE_TOKEN = process.env.DESERVE_PRIVATE_TOKEN || '';


export const IN_CONTAINER_USAGE = process.env.DESERVE_IN_CONTAINER_USAGE === 'true';
export const IN_CONTAINER_HOST_BIND = process.env.DESERVE_IN_CONTAINER_HOST_BIND || '';
// #endregion module
