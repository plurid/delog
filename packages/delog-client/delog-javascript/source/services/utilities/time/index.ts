// #region imports
    // #region libraries
    import microtime from 'microtime';
    // #endregion libraries
// #endregion imports



// #region module
const now = () => {
    if (typeof window !== 'undefined') {
        return {
            time: Date.now(),
            unit: 'ms',
        };
    }

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
