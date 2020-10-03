// #region imports
    // #region external
    import {
        Configuration,
    } from '../../data/interfaces';

    import {
        defaultConfiguration,
    } from '../../data/constants';

    import client from '../../services/graphql/client';
    import {
        LOGIN,
    } from '../../services/graphql/mutate';

    import {
        extractServerName,

        updateConfiguration,
    } from '../../services/utilities';
    // #endregion external
// #endregion imports



// #region module
const login = async (
    server: string,
    identonym: string,
    key: string,
) => {
    const delog = client(
        server,
    );

    const serverName = extractServerName(server);

    const data: Configuration = {
        ...defaultConfiguration,
        server,
        identonym,
        key,
    };

    try {
        const mutation = await delog.mutate({
            mutation: LOGIN,
            variables: {
                input: {
                    identonym,
                    key,
                },
            },
        });

        const response = mutation.data.login;

        if (!response.status) {
            console.log(`Could not log in into the delog server '${serverName}' as '${identonym}'.`);
            return;
        }

        // HACK
        // to allow the token writing inside the apollo afterwareLink
        setTimeout(async () => {
            await updateConfiguration(
                server,
                identonym,
                data,
            );
        }, 1000);

        console.log(`Logged in the delog server '${serverName}' as '${identonym}'.`);
    } catch (error) {
        console.log(`Could not log in into the delog server '${serverName}' as '${identonym}'.`);
    }
}
// #endregion module



// #region exports
export default login;
// #endregion exports
