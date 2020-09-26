// #region imports
    // #region external
    import {
        DelogData,
    } from '#data/interfaces';

    import {
        client,
        LOG,
    } from '#services/graphql';

    import {
        getConfiguration,
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
        groundLevel,

        format,

        endpoint,
        token,

        project,
        space,

        level,
        method,
        sharedID,
        sharedOrder,
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
        const graphql = client(
            endpoint,
            token,
        );

        const input = {
            format,

            project,
            space,

            level,
            method,
            sharedID,
            sharedOrder,
            error,
            extradata,

            context,

            text,

            time,
        };

        const mutation = await graphql.mutate({
            mutation: LOG,
            variables: {
                input,
            },
        });

        const response = mutation.data.delogMutationLog;

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
