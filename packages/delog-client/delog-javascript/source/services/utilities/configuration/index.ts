// #region imports
    // #region external
    import {
        GROUND_LEVEL,

        FORMAT,

        ENDPOINT,
        TOKEN,

        PROJECT,
        SPACE,

        delogLevels,
        defaultConfiguration,
    } from '#data/constants';

    import {
        DelogData,
        RequiredDelogData,
    } from '#data/interfaces';

    import {
        stringifyError,
    } from '../stringifyError';

    import {
        now,
    } from '../time';
    // #endregion external
// #endregion imports



// #region module
const getConfiguration = (
    data: string | DelogData,
) => {
    const time = now();

    if (typeof data === 'string') {
        const configuration: RequiredDelogData = {
            ...defaultConfiguration,

            text: data,
            time,
        };

        return configuration;
    }


    const configuration: RequiredDelogData = {
        text: data.text,
        time,

        groundLevel: GROUND_LEVEL,

        format: data.format || FORMAT,

        endpoint: data.endpoint || ENDPOINT,
        token: data.token || TOKEN,

        project: data.project || PROJECT,
        space: data.space || SPACE,

        level: data.level || delogLevels.info,
        method: data.method || '',

        error: stringifyError(data.error),
        extradata: data.extradata || '',

        context: data.context,
    };

    return configuration;
}
// #endregion module



// #region exports
export {
    getConfiguration,
};
// #endregion exports
