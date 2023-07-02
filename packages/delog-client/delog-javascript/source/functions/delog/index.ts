// #region imports
    // #region external
    import {
        delogLevelsText,
    } from '~data/constants';

    import {
        DelogData,
        DelogInputRecord,
        DelogInputRecordContext,
    } from '~data/interfaces';

    import {
        client,
        RECORD,
    } from '~services/graphql';

    import {
        getConfiguration,
        getCallContext,
    } from '~services/logic';

    import {
        consoleLog,
        stringifyError,
    } from '~services/utilities';
    // #endregion external
// #endregion imports



// #region module
const delog = async (
    data: string | DelogData,
) => {
    const configuration = getConfiguration(data);

    const {
        text,
        time,
        unit,
        level,
        tester,

        groundLevel,

        graphqlClient,
        endpoint,
        token,

        format,

        project,
        space,

        method,
        error,
        extradata,

        context,

        consoleFallback,
    } = configuration;


    if (!endpoint && !graphqlClient && !consoleFallback) {
        consoleLog('Delog Error :: An endpoint is required.');
        return;
    }

    if (!token && !graphqlClient && !consoleFallback) {
        consoleLog('Delog Error :: A token is required.');
        return;
    }

    if (
        tester
        && context?.mode !== 'TESTING'
    ) {
        consoleLog('Delog Error :: Tester while not in TESTING mode.');
        return;
    }

    if (groundLevel > level) {
        // consoleLog('Delog Error :: Ground level is above level.');
        return;
    }

    try {
        const callContext = getCallContext(
            context?.call,
        );

        const graphql = graphqlClient || client(
            endpoint,
            token,
        );

        const inputContext: DelogInputRecordContext = {
            mode: context?.mode,
            scenario: context?.scenario,
            suite: context?.suite,
            sharedID: context?.sharedID,
            sharedOrder: context?.sharedOrder,
            call: callContext,
        };

        const input: DelogInputRecord = {
            text,
            time,
            level,

            unit,

            format,

            project,
            space,

            method,
            error,
            extradata,
            context: inputContext,
        };

        if (consoleFallback) {
            const level = (delogLevelsText as any)[input.level];
            const time = input.unit === 'us'
                ? new Date(input.time / 1000).toLocaleString()
                : new Date().toLocaleString();

            const errorString = input.error
                ? ` · ${input.error}`
                : '';

            console.log(`[${level} ${time}] · ${input.text}${errorString}`);
            return;
        }

        const mutation = await graphql.mutate({
            mutation: RECORD,
            variables: {
                input,
            },
        });

        const response = mutation.data.delogMutationRecord;

        if (!response.status) {
            consoleLog('Delog Error :: Could not record on server.');
            return;
        }

        return true;
    } catch (error) {
        consoleLog('Delog Error :: ' + stringifyError(error));

        return;
    }
}
// #endregion module



// #region exports
export default delog;
// #endregion exports
