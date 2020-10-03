// #region imports
    // #region external
    import {
        getConfiguration,
        removeConfiguration,
        extractServerName,
    } from '../../services/utilities';
    // #endregion external
// #endregion imports



// #region module
const logout = async (
    server?: string,
    identonym?: string,
) => {
    const configuration = await getConfiguration(
        server,
        identonym,
    );

    if (!configuration) {
        return;
    }

    if (!configuration.server) {
        console.log(`Not logged into a delog server.`);
        return;
    }

    await removeConfiguration(
        configuration.server,
        configuration.identonym,
    );

    const serverName = extractServerName(configuration.server);

    console.log(`Logged out identonym '${configuration.identonym}' from the delog server '${serverName}'.`);
}
// #endregion module



// #region exports
export default logout;
// #endregion exports
