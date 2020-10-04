// #region imports
    // #region external
    import {
        DelogContextCall,
        DelogInputRecordContextCall,
        DelogInputRecordContextCaller,
    } from '../../../data/interfaces';

    import {
        CALL_CONTEXT,
        CODE_PROVIDER,
        REPOSITORY_NAME,
        REPOSITORY_BASEPATH,

        DEFAULT_CALL_DEPTH,
    } from '../../../data/constants';
    // #endregion external
// #endregion imports



// #region module
const callsites = () => {
	const _prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;

	const stack = new Error().stack!.slice(1);
    Error.prepareStackTrace = _prepareStackTrace;

	return stack as any;
};


const getCallContext = (
    call?: DelogContextCall,
) => {
    if (!call && !CALL_CONTEXT) {
        return;
    }

    try {
        const callDepth = call?.depth || DEFAULT_CALL_DEPTH;
        const calls = callsites();

        const caller: DelogInputRecordContextCaller = {
            file: calls[callDepth].getFileName() || '',
            line: calls[callDepth].getLineNumber() || -1,
            column: calls[callDepth].getColumnNumber() || -1,
        };

        if (!caller) {
            return;
        }

        const provider = call?.codeProvider || CODE_PROVIDER;
        const repositoryName = call?.repositoryName || REPOSITORY_NAME;
        const repositoryBasepath = call?.repositoryBasePath || REPOSITORY_BASEPATH || process.cwd();

        const {
            file,
            line,
            column,
        } = caller;

        const filepath = file.replace(repositoryBasepath, '');

        const callContext: DelogInputRecordContextCall = {
            provider,
            repository: repositoryName,
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
