// #region imports
    // #region libraries
    import {
        promises as fs,
    } from 'fs';
    // #endregion libraries
// #endregion imports



// #region module
const fileExists = async (
    path: string,
) => !!(await fs.stat(path).catch(e => false));


/**
 * Source: https://stackoverflow.com/a/57335271
 *
 * @param callback Function to be called.
 * @param wait Debounce time.
 */
function debouncedCallback<A extends any[]>(
    callback: (...args: A) => void,
    wait: number,
) {
    // track args & timeout handle between calls
    let argsRef: any;
    let timeout: any;

    function cleanup() {
        if (timeout) {
            clearTimeout(timeout);
        }
    }

    return function debouncedCallback(
        ...args: A
    ) {
        // capture latest args
        argsRef = args;

        // clear debounce timer
        cleanup();

        // start waiting again
        timeout = setTimeout(() => {
            if(argsRef) {
                callback(...argsRef);
            }
        }, wait);
    };
}


const extractServerName = (
    server: string,
) => {
    return server.replace(/https?:\/\//, '');
}
// #endregion module



// #region exports
export {
    fileExists,
    debouncedCallback,
    extractServerName,
};
// #endregion exports
