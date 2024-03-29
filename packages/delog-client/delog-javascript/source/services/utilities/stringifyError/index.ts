// #region module
const replaceErrors = (
    _: string,
    value: any,
) => {
    if (value instanceof Error) {
        const error: any = {};

        Object.getOwnPropertyNames(value).forEach((key) => {
            error[key] = (value as any)[key];
        });

        return error;
    }

    return value;
}


const stringifyError = (
    error?: any,
) => {
    if (!error) {
        return;
    }

    return JSON.stringify(
        error,
        replaceErrors,
    );
}
// #endregion module



// #region exports
export {
    stringifyError,
    replaceErrors,
};
// #endregion exports
