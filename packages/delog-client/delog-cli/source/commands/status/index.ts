// #region imports
    // #region external
    import {
        readConfigurations,
        extractServerName,
    } from '../../services/utilities';
    // #endregion external
// #endregion imports



// #region module
const status = async () => {
    const configurations = await readConfigurations();

    if (configurations.length === 0) {
        console.log(`Not logged into a delog server.`);
        return;
    }

    for (const configuration of configurations) {
        const {
            server,
            identonym,
            isDefault,
        } = configuration;

        const serverName = extractServerName(server);
        const defaultString = isDefault ? ' [default]' : '';

        const message = `Logged into the delog server '${serverName}' as '${identonym}'` + defaultString + '.';

        console.log(message);
    }
}
// #endregion module



// #region exports
export default status;
// #endregion exports
