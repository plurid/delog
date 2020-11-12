// #region imports
    // #region external
    import {
        QUIET,
    } from '#data/constants';
    // #endregion external
// #endregion imports



// #region module
const consoleLog = (
    text: string,
) => {
    if (!QUIET) {
        console.log(text);
    }
}
// #endregion module



// #region exports
export {
    consoleLog,
};
// #endregion exports
