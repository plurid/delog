// #region imports
    // #region external
    import {
        InputLinkRepository,
    } from '#server/data/interfaces';

    import {
        BITBUCKET_PROVIDER,
        GITHUB_PROVIDER,
    } from '#server/data/constants';

    import {
        loadProviders,
    } from '#server/logic/loader';

    import {
        registerRepositoryMetadata,
    } from '#server/logic/operators/repositories';
    // #endregion external


    // #region internal
    import github from './github';
    // #endregion internal
// #endregion imports



// #region module
export const getProvider = async (
    providerID: string,
) => {
    const providers = await loadProviders();
    const provider = providers.find(
        provider => provider.id === providerID,
    );

    return provider;
}


export const getRepositoriesData = async (
    providerID: string,
) => {
    const provider = await getProvider(providerID);
    if (!provider) {
        return;
    }

    switch (provider.type) {
        case BITBUCKET_PROVIDER:
            return;
        case GITHUB_PROVIDER:
            return github.getRepositoriesData(
                provider,
            );
    }
}


export const getRepositoryDataByNameWithOwner = async (
    providerID: string,
    nameWithOwner: string,
) => {
    const provider = await getProvider(providerID);
    if (!provider) {
        return;
    }

    switch (provider.type) {
        case BITBUCKET_PROVIDER:
            return;
        case GITHUB_PROVIDER:
            return github.getRepositoryDataByNameWithOwner(
                provider,
                nameWithOwner,
            );
    }
}


export const getRepository = async (
    providerID: string,
    name: string,
) => {
    const provider = await getProvider(providerID);
    if (!provider) {
        return;
    }

    switch (provider.type) {
        case BITBUCKET_PROVIDER:
            return;
        case GITHUB_PROVIDER:
            return github.getRepository(
                provider.token,
                name,
            );
    }
}


export const getOwner = async (
    providerID: string,
) => {
    const provider = await getProvider(providerID);
    if (!provider) {
        return;
    }

    switch (provider.type) {
        case BITBUCKET_PROVIDER:
            return;
        case GITHUB_PROVIDER:
            return github.getOwner(
                provider,
            );
    }
}


export const handleLinkRepository = async (
    input: InputLinkRepository,
) => {
    const {
        providerID,
        nameWithOwner,
    } = input;

    const repositoryData = await getRepositoryDataByNameWithOwner(
        providerID,
        nameWithOwner,
    );

    if (!repositoryData) {
        return;
    }

    const {
        name,
    } = repositoryData;

    if (!name) {
        return;
    }

    await getRepository(
        providerID,
        name,
    );

    await registerRepositoryMetadata(
        repositoryData,
    );

    return repositoryData;
}
// #endregion module
