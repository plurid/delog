// #region imports
    // #region external
    import {
        Provider,
        Imagene,
        Notifier,
        Repository,
        Project,
        Secret,
        SecretStored,
        Webhook,
        Trigger,
        Deployer,
        Build,
        BuildData,
        Deploy,
    } from '#server/data/interfaces';

    import {
        compareValues,
    } from '#server/utilities';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
export const loadProviders = async () => {
    const providers: Provider[] = await database.getAll('providers');

    return providers || [];
}


export const loadImagenes = async () => {
    const imagenes: Imagene[] = await database.getAll('imagenes');

    const sortedImagenes = imagenes.sort(
        compareValues('name'),
    );

    return sortedImagenes || [];
}


export const loadNotifiers = async () => {
    const notifiers: Notifier[] = await database.getAll('notifiers');

    return notifiers || [];
}


export const loadRepositories = async () => {
    const repositories: Repository[] = await database.getAll('repositories');

    return repositories || [];
}


export const loadWebhooks = async () => {
    const webhooks: Webhook[] = await database.getAll('webhooks');

    return webhooks || [];
}


export const loadProjects = async () => {
    const projects: Project[] = await database.getAll('projects');

    return projects || [];
}


export const loadStoredSecrets = async () => {
    const storedSecrets: SecretStored[] = await database.getAll('secrets');

    return storedSecrets || [];
}


export const loadSecrets = async () => {
    const storedSecrets = await loadStoredSecrets();
    const secrets = storedSecrets.map(storedSecret => {
        const {
            id,
            name,
            project,
            value,
        } = storedSecret;

        const secret: Secret = {
            id,
            name,
            project,
            startsWith: value.slice(0, 5),
        };

        return secret;
    });

    return secrets;
}


export const loadTriggers = async () => {
    const triggers: Trigger[] = await database.getAll('triggers');

    return triggers || [];
}


export const loadDeployers = async () => {
    const deployers: Deployer[] = await database.getAll('deployers');

    return deployers || [];
}


export const loadBuildsQueued = async () => {
    const buildsQueued: BuildData[] = await database.getAll('buildsQueue');

    return buildsQueued || [];
}


export const loadBuilds = async () => {
    const builds: Build[] = await database.getAll('builds');

    const sortedBuilds = builds.sort(
        compareValues('date', 'desc'),
    );

    return sortedBuilds || [];
}


export const loadDeploys = async () => {
    const deploys: Deploy[] = await database.getAll('deploys');

    const sortedDeploys = deploys.sort(
        compareValues('date', 'desc'),
    );

    return sortedDeploys || [];
}


const loadData = async () => {
    const providers = await loadProviders();
    const imagenes = await loadImagenes();
    const notifiers = await loadNotifiers();
    const repositories = await loadRepositories();
    const webhooks = await loadWebhooks();
    const projects = await loadProjects();
    const secrets = await loadSecrets();
    const triggers = await loadTriggers();
    const deployers = await loadDeployers();
    const builds = await loadBuilds();
    const deploys = await loadDeploys();


    const data = {
        providers,
        imagenes,
        notifiers,
        repositories,
        webhooks,
        projects,
        secrets,
        triggers,
        deployers,
        builds,
        deploys,
    };

    return data;
}
// #endregion module



// #region exports
export default loadData;
// #endregion exports
