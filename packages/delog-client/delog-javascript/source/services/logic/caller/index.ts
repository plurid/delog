// #region imports
    // #region external
    import {
        DelogContextCall,
        DelogInputRecordContextCall,
        DelogInputRecordContextRepository,
        DelogInputRecordContextCaller,
    } from '../../../data/interfaces';

    import {
        CALL_CONTEXT,
        REPOSITORY_PROVIDER,
        REPOSITORY_BRANCH,
        REPOSITORY_COMMIT,
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
        const callRepository = call?.repository;

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

        const provider = callRepository?.provider || REPOSITORY_PROVIDER;
        const repositoryName = callRepository?.name || REPOSITORY_NAME;
        const repositoryBranch = callRepository?.branch || REPOSITORY_BRANCH;
        const repositoryCommit = callRepository?.commit || REPOSITORY_COMMIT;
        const repositoryBasePath = callRepository?.basePath || REPOSITORY_BASEPATH;

        const {
            file,
            line,
            column,
        } = caller;

        const filepath = file.replace(repositoryBasePath, '');

        const repository: DelogInputRecordContextRepository = {
            provider,
            name: repositoryName,
            branch: repositoryBranch,
            commit: repositoryCommit,
            basePath: repositoryBasePath,
        };

        const callContext: DelogInputRecordContextCall = {
            repository,
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
