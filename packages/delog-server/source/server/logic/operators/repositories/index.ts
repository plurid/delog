// #region imports
    // #region libraries
    import path from 'path';

    import {
        execSync,
    } from 'child_process';
    // #endregion libraries


    // #region external
    import {
        Repository,
        Provider,
    } from '~server/data/interfaces';

    import {
        repositoriesPath,
        BASE_PATH_REPOSITORIES,
    } from '~server/data/constants';

    import {
        CodeProvider,
    } from '~server/data/interfaces';

    import {
        loadRepositories,
    } from '~server/logic/loader';

    import database from '~server/services/database';
    import storage from '~server/services/storage';
    // #endregion external
// #endregion imports



// #region module
export const registerRepositoryMetadata = async (
    repository: Repository,
) => {
    const {
        id,
    } = repository;

    await database.store(
        'repositories',
        id,
        repository,
    );
}


export const deregisterRepository = async (
    id: string,
) => {
    const repository: Repository | undefined = await database.get(
        'repositories',
        id,
    );

    if (!repository) {
        return;
    }

    const {
        name,
        providerID,
    } = repository;

    const provider: Provider | undefined = await database.get(
        'providers',
        providerID,
    );

    if (!provider) {
        return;
    }

    const repositoryPath = path.join(
        BASE_PATH_REPOSITORIES,
        '/' + provider.type + '/' + name,
    );

    await storage.obliterateAll(
        repositoryPath,
    );

    await database.obliterate(
        'repositories',
        {
            id,
        },
    );
}


export const getActiveRepository = async (
    repositoryName: string,
    ownedBy: string,
) => {
    const repositories = await loadRepositories(
        ownedBy,
    );

    let activeRepository: Repository | undefined;
    for (const watchedRepository of repositories) {
        if (watchedRepository.name === repositoryName) {
            activeRepository = {
                ...watchedRepository,
            };
            break;
        }
    }

    return activeRepository;
}


export const updateRootRepository = async (
    repositoryName: string,
    type: CodeProvider,
) => {
    const repositoryPath = path.join(
        repositoriesPath,
        `/${type}/${repositoryName}`,
    );
    const repositoryRootPath = path.join(
        repositoryPath,
        '/root',
    );

    const gitCommandFetchOrigin = 'git fetch origin';
    const gitCommandPull = 'git pull';

    execSync(gitCommandFetchOrigin, {
        cwd: repositoryRootPath,
        stdio: 'ignore',
    });

    execSync(gitCommandPull, {
        cwd: repositoryRootPath,
        stdio: 'ignore',
    });
}


export const updateWorkRepository = async (
    branchName: string,
    repositoryWorkPath: string,
) => {
    const gitCommandFetchOrigin = 'git fetch origin';
    const gitCommandResetHardBranch = `git reset --hard origin/${branchName}`;

    execSync(gitCommandFetchOrigin, {
        cwd: repositoryWorkPath,
        stdio: 'ignore',
    });

    execSync(gitCommandResetHardBranch, {
        cwd: repositoryWorkPath,
        stdio: 'ignore',
    });
}
// #endregion module
