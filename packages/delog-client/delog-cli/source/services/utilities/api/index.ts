// #region imports
    // #region external
    import {
        DELOG_COOKIE,
    } from '../../../data/constants';

    import {
        client,
    } from '../../graphql';

    import {
        readConfigurationFile,
    } from '../configuration';
    // #endregion external
// #endregion imports



// #region module
const delogCookieFromToken = (
    token: string,
) => {
    return DELOG_COOKIE + '=' + token;
}


const getDelog = async () => {
    const configuration = await readConfigurationFile();

    if (!configuration.token || !configuration.server) {
        return;
    }

    const cookie = delogCookieFromToken(configuration.token);

    const delog = client(
        configuration.server,
        cookie,
    );

    return delog;
}
// #endregion module



// #region exports
export {
    delogCookieFromToken,
    getDelog,
};
// #endregion exports
