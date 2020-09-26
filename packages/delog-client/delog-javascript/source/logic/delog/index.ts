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
    } from '#services/utilities';
    // #endregion external
// #endregion imports



// #region module
const delog = (
    data: string | DelogData,
) => {
    const configuration = getConfiguration(data);

    const {
        groundLevel,

        endpoint,
        token,
        project,
        package: packagName,
        format,

        method,
        level,
        state,
    } = configuration;

    // if (groundLevel > level) {
    //     return;
    // }

    const graphql = client(
        endpoint,
        token,
    );

    const input = {
        endpoint,
        token,
        project,
        package: packagName,
        format,

        method,
        level,
        state,
    };

    try {
        graphql.mutate({
            mutation: LOG,
            variables: {
                input,
            },
        });
    } catch (error) {
        console.log(error);
    }

    return;
}
// #endregion module



// #region exports
export default delog;
// #endregion exports
