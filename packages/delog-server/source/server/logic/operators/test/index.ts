// #region imports
    // #region external
    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const deregisterTest = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'tests',
            id,
        );
    } catch (error) {
        return;
    }
}

const deregisterTests = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'tests',
            id,
        );
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    deregisterTest,
    deregisterTests,
};
// #endregion exports
