// #region module
let microtime: any;

const loadMicrotime = async () => {
    if (typeof window !== 'undefined') {
        return;
    }

    const name = 'microtime';
    microtime = await import(name);
}

loadMicrotime();

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
