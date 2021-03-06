// #region imports
    // #region external
    import {
        GROUND_LEVEL,

        FORMAT,

        ENDPOINT,
        TOKEN,

        PROJECT,
        SPACE,

        CONSOLE_FALLBACK,

        delogLevels,
        defaultConfiguration,
    } from '~data/constants';

    import {
        DelogData,
        RequiredDelogData,
    } from '~data/interfaces';

    import {
        stringifyError,
        now,
    } from '~services/utilities';
    // #endregion external
// #endregion imports



// #region module
const getConfiguration = (
    data: string | DelogData,
) => {
    const {
        time,
        unit,
    } = now();

    if (typeof data === 'string') {
        const configuration: RequiredDelogData = {
            ...defaultConfiguration,

            text: data,
            time,
            unit,
        };

        return configuration;
    }

    const level = typeof data.level === 'string'
        ? delogLevels[data.level]
        : data.level || delogLevels.info;


    const configuration: RequiredDelogData = {
        text: data.text,
        time,
        level,

        unit,

        graphqlClient: data.graphqlClient,

        groundLevel: GROUND_LEVEL,

        endpoint: data.endpoint || ENDPOINT,
        token: data.token || TOKEN,

        format: data.format || FORMAT,

        project: data.project || PROJECT,
        space: data.space || SPACE,

        method: data.method || '',

        error: stringifyError(data.error),
        extradata: data.extradata || '',

        context: data.context,

        consoleFallback: data.consoleFallback ?? CONSOLE_FALLBACK,
    };

    return configuration;
}
// #endregion module



// #region exports
export {
    getConfiguration,
};
// #endregion exports
