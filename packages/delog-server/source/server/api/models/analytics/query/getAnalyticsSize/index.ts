// #region imports
    // #region external
    import {
        InputGetAnalyticsSize,
        Context,
    } from '~server/data/interfaces';

    import {
        generateMethodLogs,
    } from '~server/utilities';

    import {
        analyticsSize,
    } from '~server/logic/operators/analytics';
    // #endregion external
// #endregion imports



// #region module
export const getAnalyticsSizeLogs = generateMethodLogs('getAnalyticsSize');

const getAnalyticsSize = async (
    input: InputGetAnalyticsSize,
    context: Context,
) => {
    // #region context unpack
    const {
        request,

        privateUsage,
        privateOwnerIdentonym,

        customLogicUsage,

        logger,
        logLevels,
    } = context;
    // #endregion context unpack


    // #region log start
    logger.log(
        getAnalyticsSizeLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region private usage
        if (privateUsage) {
            logger.log(
                getAnalyticsSizeLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    getAnalyticsSizeLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const result = await analyticsSize(
                input,
                privateOwnerIdentonym,
            );

            logger.log(
                getAnalyticsSizeLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: {
                    ...result,
                },
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                getAnalyticsSizeLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const result = await analyticsSize(
                input,
                '',
            );

            return {
                status: true,
                data: {
                    ...result,
                },
            };
        }
        // #endregion logic usage


        // #region public usage
        logger.log(
            getAnalyticsSizeLogs.infoSuccessCustomLogicUsage,
            logLevels.info,
        );

        const result = await analyticsSize(
            input,
            '',
        );

        return {
            status: true,
            data: {
                ...result,
            },
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            getAnalyticsSizeLogs.errorEnd,
            logLevels.error,
            error,
        );

        return {
            status: false,
        };
        // #endregion error handle
    }
}
// #endregion module



// #region exports
export default getAnalyticsSize;
// #endregion exports
