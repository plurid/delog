// #region module
const callsites = () => {
	const _prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;

	const stack = new Error().stack!.slice(1);
    Error.prepareStackTrace = _prepareStackTrace;

	return stack as any;
};


const getCallContext = () => {
    try {
        const calls = callsites();

        const caller = {
            file: calls[1].getFileName(),
            line: calls[1].getLineNumber(),
            column: calls[1].getColumnNumber(),
        };

        if (!caller) {
            return;
        }

        const {
            file,
            line,
            column
        } = caller;

        // const cwd = process.cwd();
        const BASE_PATH = '';
        const filepath = file.replace(BASE_PATH, '');

        const callContext = {
            provider: '',
            repository: '',
            caller: {
                file: filepath,
                line,
                column,
            },
        };

        return callContext;
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    callsites,
    getCallContext,
};
// #endregion exports
