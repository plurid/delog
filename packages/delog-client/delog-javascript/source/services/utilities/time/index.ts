// #region module
let microtime: any;

const loadMicrotime = async () => {
    if (typeof window !== 'undefined') {
        return;
    }

    if (typeof process === 'undefined') {
        return;
    }

    const name = 'microtime';
    microtime = await import(name);
}

loadMicrotime();

const now = () => {
    try {
        if (typeof window !== 'undefined' || typeof process === 'undefined') {
            return {
                time: Date.now(),
                unit: 'ms',
            };
        }

        return {
            time: microtime.now(),
            unit: 'us',
        };
    } catch (error) {
        return {
            time: Date.now(),
            unit: 'ms',
        };
    }
}
// #endregion module



// #region exports
export {
    now,
};
// #endregion exports
