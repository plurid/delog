// #region imports
    // #region external
    import {
        DelogData,
        DelogInputRecord,
        DelogInputRecordContext,
    } from '#data/interfaces';

    import {
        client,
        RECORD,
    } from '#services/graphql';

    import {
        getConfiguration,
        getCallContext,
    } from '#services/logic';

    import {
        stringifyError,
    } from '#services/utilities';
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
    } = configuration;


    if (!endpoint && graphqlClient) {
        console.log('Delog Error :: An endpoint is required.');
        return;
    }

    if (!token && graphqlClient) {
        console.log('Delog Error :: A token is required.');
        return;
    }

    if (
        tester
        && context?.mode !== 'TESTING'
    ) {
        return;
    }

    if (groundLevel > level) {
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

            format,

            project,
            space,

            method,
            error,
            extradata,
            context: inputContext,
        };

        const mutation = await graphql.mutate({
            mutation: RECORD,
            variables: {
                input,
            },
        });

        const response = mutation.data.delogMutationRecord;

        if (!response.status) {
            return;
        }

        return true;
    } catch (error) {
        console.log('Delog Error ::', stringifyError(error));

        return;
    }
}
// #endregion module



// #region exports
export default delog;
// #endregion exports
