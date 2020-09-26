// #region imports
    // #region external
    import * as Types from '../types';

    import {
        ClientProvider,
        Imagene,
        Repository,
        Project,
        Secret,
        Webhook,
        Trigger,
        Deployer,
        Build,
        Deploy,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const addEntity = (
    payload: Types.AddEntityPayload,
): Types.AddEntityAction => {
    return {
        type: Types.ADD_ENTITY,
        payload,
    };
}


export const removeEntity = (
    payload: Types.RemoveEntityPayload,
): Types.RemoveEntityAction => {
    return {
        type: Types.REMOVE_ENTITY,
        payload,
    };
}


export const setActiveProviderID = (
    providerID: string,
): Types.SetActiveProviderIDAction => {
    return {
        type: Types.SET_ACTIVE_PROVIDER_ID,
        payload: providerID,
    };
}


export const setProviders = (
    providers: ClientProvider[],
): Types.SetProvidersAction => {
    return {
        type: Types.SET_PROVIDERS,
        payload: providers,
    };
}


export const setImagenes = (
    imagenes: Imagene[],
): Types.SetImagenesAction => {
    return {
        type: Types.SET_IMAGENES,
        payload: imagenes,
    };
}


export const setRepositories = (
    repositories: Repository[],
): Types.SetRepositoriesAction => {
    return {
        type: Types.SET_REPOSITORIES,
        payload: repositories,
    };
}


export const setProjects = (
    projects: Project[],
): Types.SetProjectsAction => {
    return {
        type: Types.SET_PROJECTS,
        payload: projects,
    };
}


export const setSecrets = (
    secrets: Secret[],
): Types.SetSecretsAction => {
    return {
        type: Types.SET_SECRETS,
        payload: secrets,
    };
}


export const setWebhooks = (
    webhooks: Webhook[],
): Types.SetWebhooksAction => {
    return {
        type: Types.SET_WEBHOOKS,
        payload: webhooks,
    };
}


export const setTriggers = (
    triggers: Trigger[],
): Types.SetTriggersAction => {
    return {
        type: Types.SET_TRIGGERS,
        payload: triggers,
    };
}


export const setDeployers = (
    triggers: Deployer[],
): Types.SetDeployersAction => {
    return {
        type: Types.SET_DEPLOYERS,
        payload: triggers,
    };
}


export const setBuilds = (
    builds: Build[],
): Types.SetBuildsAction => {
    return {
        type: Types.SET_BUILDS,
        payload: builds,
    };
}


export const clearBuilds = (): Types.ClearBuildsAction => {
    return {
        type: Types.CLEAR_BUILDS,
        payload: undefined,
    };
}


export const setDeploys = (
    builds: Deploy[],
): Types.SetDeploysAction => {
    return {
        type: Types.SET_DEPLOYS,
        payload: builds,
    };
}


export const clearDeploys = (): Types.ClearDeploysAction => {
    return {
        type: Types.CLEAR_DEPLOYS,
        payload: undefined,
    };
}


export const clearData = (): Types.ClearDataAction => {
    return {
        type: Types.CLEAR_DATA,
        payload: undefined,
    };
}



const actions = {
    addEntity,
    removeEntity,
    setActiveProviderID,
    setProviders,
    setImagenes,
    setRepositories,
    setProjects,
    setSecrets,
    setWebhooks,
    setTriggers,
    setDeployers,
    setBuilds,
    clearBuilds,
    setDeploys,
    clearDeploys,
    clearData,
};
// #endregion module



// #region exports
export default actions;
// #endregion exports
