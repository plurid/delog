// #region imports
    // #region external
    import {
        getDelog,
    } from '../../services/utilities';

    import {
        getConfiguration,
        updateConfiguration,
    } from '../../services/utilities'
    // #endregion external
// #endregion imports



// #region module
const setup = async (
    data: any,
    server?: string,
    identonym?: string,
) => {
    try {
        const configuration = await getConfiguration(
            server,
            identonym,
        );

        if (!configuration) {
            console.log('Could not setup delog server. Not logged in.');
            return;
        }

        if (typeof data.default === 'boolean') {
            configuration.isDefault = data.default;
        }

        if (data.format) {
            configuration.defaults.format = data.format;
        }

        await updateConfiguration(
            configuration.server,
            configuration.identonym,
            configuration,
        );

        console.log(`Delog server setup.`);

        return;
    } catch (error) {
        console.log('Could not setup delog server. Something went wrong.');
        return;
    }
}
// #endregion module



// #region exports
export default setup;
// #endregion exports
