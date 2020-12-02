// #region imports
    // #region external
    import {
        InputGetCode,
    } from '~server/data/interfaces';

    import {
        gitLastCommit,
        gitShowFile,
    } from '../git';
    // #endregion external
// #endregion imports



// #region module
const getCodeLines = async (
    input: InputGetCode,
) => {
    // #region input unpack
    const {
        repository,
        context,
    } = input;

    const {
        provider,
        name,
    } = repository;

    const {
        file
    } = context;
    // #endregion input unpack

    const repositoryPath = '/data/repositories/'
        + provider + '/'
        + name + '/'
        + 'root' + '/';

    const gitCommit = await gitLastCommit(
        repositoryPath,
    );

    if (!gitCommit) {
        return [];
    }

    const data = await gitShowFile(
        repositoryPath,
        gitCommit,
        file,
    );

    if (!data) {
        return [];
    }

    return [
        ...data.split('\n'),
    ];
}
// #endregion module


// #region exports
export {
    getCodeLines,
};
// #endregion exports
