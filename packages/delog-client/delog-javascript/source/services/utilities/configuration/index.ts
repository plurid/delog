// #region imports
    // #region external
    import {
        ENDPOINT,
        TOKEN,
        PROJECT,
        SPACE,
        GROUND_LEVEL,
        FORMAT,

        logLevels,
        defaultConfiguration,
    } from '#data/constants';

    import {
        DelogData,
        RequiredDelogData,
    } from '#data/interfaces';

    import {
        stringifyError,
    } from '../stringifyError';
    // #endregion external
// #endregion imports



// #region module
const getConfiguration = (
    data: string | DelogData,
) => {
    if (typeof data === 'string') {
        const configuration: RequiredDelogData = {
            ...defaultConfiguration,
            text: data,
        };

        return configuration;
    }


    const configuration: RequiredDelogData = {
        groundLevel: GROUND_LEVEL,

        format: data.format || FORMAT || '',

        endpoint: data.endpoint || ENDPOINT || '',
        token: data.token || TOKEN || '',

        project: data.project || PROJECT || '',
        space: data.space || SPACE || '',

        level: data.level || logLevels.info,
        method: data.method || '',
        sharedID: data.sharedID || '',
        error: stringifyError(data.error),
        extradata: data.extradata || '',

        text: data.text,
    };

    return configuration;
}
// #endregion module



// #region exports
export {
    getConfiguration,
};
// #endregion exports
