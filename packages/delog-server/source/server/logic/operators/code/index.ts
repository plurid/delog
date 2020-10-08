// #region imports
    // #region external
    import {
        InputGetCode,
    } from '#server/data/interfaces';

    import storage from '#server/services/storage';
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

    const filepath = repositoryPath + file;

    const data = await storage.download(filepath);

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
