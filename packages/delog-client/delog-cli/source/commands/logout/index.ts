// #region imports
    // #region external
    import {
        ConfigurationFile,
    } from '../../data/interfaces';

    import {
        readConfigurationFile,
        updateConfigurationFile,
        extractServerName,
    } from '../../services/utilities';
    // #endregion external
// #endregion imports



// #region module
const logout = async () => {
    const ownerData = await readConfigurationFile();

    if (!ownerData.server) {
        console.log(`Not logged into a delog server.`);
        return;
    }

    const data: ConfigurationFile = {
        identonym: '',
        key: '',
        server: '',
        token: '',
    };
    await updateConfigurationFile(data);

    const serverName = extractServerName(ownerData.server);

    console.log(`Logged out identonym '${ownerData.identonym}' from the delog server '${serverName}'.`);
}
// #endregion module



// #region exports
export default logout;
// #endregion exports
