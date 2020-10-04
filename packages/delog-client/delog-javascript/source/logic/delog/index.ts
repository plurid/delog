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
        stringifyError,
        getCallContext,
    } from '#services/utilities';
    // #endregion external
// #endregion imports



// #region module
const delog = async (
    data: string | DelogData,
) => {
    const configuration = getConfiguration(data);

    const {
        groundLevel,

        format,

        endpoint,
        token,

        project,
        space,

        level,
        method,
        error,
        extradata,

        context,

        text,

        time,
    } = configuration;


    if (!endpoint) {
        console.log('Delog Error :: An endpoint is required.');
        return;
    }

    if (!token) {
        console.log('Delog Error :: A token is required.');
        return;
    }


    if (groundLevel > level) {
        return;
    }

    try {
        const callContext = getCallContext(
            context.call,
        );

        const graphql = client(
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
            format,

            project,
            space,

            level,
            method,
            error,
            extradata,

            context: inputContext,

            text,

            time,
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
