// #region imports
    // #region external
    import {
        ENDPOINT,
        TOKEN,
        PROJECT,
        PACKAGE,
        GROUND_LEVEL,
        FORMAT,
    } from '#data/constants';

    import {
        DelogData,
        RequiredDelogData,
    } from '#data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const getConfiguration = (
    data: string | DelogData,
) => {
    if (typeof data === 'string') {
        const defaultConfiguration = {
            groundLevel: GROUND_LEVEL || '',

            endpoint: ENDPOINT || '',
            token: TOKEN || '',
            project: PROJECT || '',
            package: PACKAGE || '',
            format: FORMAT || '',

            method: '',
            level: '',
            state: '',
        };

        return defaultConfiguration;
    }


    const configuration: RequiredDelogData = {
        groundLevel: GROUND_LEVEL || '',

        endpoint: data.endpoint || ENDPOINT || '',
        token: data.token || TOKEN || '',
        project: data.project || PROJECT || '',
        package: data.package || PACKAGE || '',
        format: data.format || FORMAT || '',

        method: data.method,
        level: data.level,
        state: data.state,
    };

    return configuration;
}
// #endregion module



// #region exports
export {
    getConfiguration,
};
// #endregion exports
