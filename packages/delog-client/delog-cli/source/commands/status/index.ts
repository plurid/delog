// #region imports
    // #region external
    import {
        readConfigurationFile,
        extractServerName,
    } from '../../services/utilities';
    // #endregion external
// #endregion imports



// #region module
const status = async () => {
    const ownerData = await readConfigurationFile();

    if (
        !ownerData.server
        || !ownerData.identonym
        || !ownerData.token
        || !ownerData.key
    ) {
        console.log(`Not logged into a delog server.`);
        return;
    }

    const serverName = extractServerName(ownerData.server);

    console.log(`Logged into the delog server '${serverName}' as '${ownerData.identonym}'.`);
}
// #endregion module



// #region exports
export default status;
// #endregion exports
