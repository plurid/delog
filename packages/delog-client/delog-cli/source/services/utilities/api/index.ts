// #region imports
    // #region external
    import {
        DELOG_COOKIE,
    } from '../../../data/constants';

    import {
        client,
    } from '../../graphql';

    import {
        getConfiguration,
    } from '../configuration';
    // #endregion external
// #endregion imports



// #region module
const delogCookieFromToken = (
    token: string,
) => {
    return DELOG_COOKIE + '=' + token;
}


const getDelog = async (
    server?: string,
    identonym?: string,
) => {
    const configuration = await getConfiguration(
        server,
        identonym,
    );

    if (!configuration) {
        return {
            delog: undefined,
            configuration: undefined,
        };
    }

    const {
        token,
    } = configuration;

    if (!token || !configuration.server) {
        return {
            delog: undefined,
            configuration: undefined,
        };
    }

    const cookie = delogCookieFromToken(token);

    const delog = client(
        configuration.server,
        cookie,
    );

    return {
        delog,
        configuration,
    };
}
// #endregion module



// #region exports
export {
    delogCookieFromToken,
    getDelog,
};
// #endregion exports
