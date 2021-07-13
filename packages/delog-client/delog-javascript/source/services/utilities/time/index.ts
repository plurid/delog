// #region imports
    // #region libraries
    import microtime from 'microtime';
    // #endregion libraries
// #endregion imports



// #region module
const now = () => {
    return {
        time: microtime.now(),
        unit: 'us',
    };
}
// #endregion module



// #region exports
export {
    now,
};
// #endregion exports
