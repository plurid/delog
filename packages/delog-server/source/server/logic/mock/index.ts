// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        PerformerLogic,
    } from '#server/data/interfaces';

    import {
        logLevel,
    } from '#server/data/constants';

    import Logger from '#server/logic/logger';
    // #endregion external
// #endregion imports



// #region module
const performerLogic: PerformerLogic = {
    getCurrentOwner: async () => {
        return {
            id: uuid.generate(),
            providers: [],
            imagenes: [],
            notifiers: [],
            repositories: [],
            webhooks: [],
            projects: [],
            secrets: [],
            triggers: [],
            deployers: [],
            builds: [],
            deploys: [],
        };
    },
    checkOwnerToken: async (
        token: string,
    ) => {
        if (!token) {
            return false;
        }

        return true;
    },
    getOwnerToken: async (
        identonym,
        key,
    ) => {
        return {
            token: 'owner-token',
        };
    },

    provider: {
        register: async (
            input,
        ) => {
            return undefined;
        },
        deregister: async (
            input,
        ) => {
            return true;
        },
    },

    imagene: {
        register: async (
            input,
        ) => {
            return undefined;
        },
        deregister: async (
            id,
        ) => {
            return true;
        },
    },

    notifier: {
        register: async (
            input,
        ) => {
            return undefined;
        },
        deregister: async (
            id,
        ) => {
            return true;
        },
    },

    builds: {
        clear: async () => {
            return true;
        },
        getByID: async (
            id,
        ) => {
            return undefined;
        },
        getBuildLog: async (
            id,
        ) => {
            return undefined;
        },
    },

    logger: new Logger(logLevel),
};
// #endregion module



// #region exports
export default performerLogic;
// #endregion exports
