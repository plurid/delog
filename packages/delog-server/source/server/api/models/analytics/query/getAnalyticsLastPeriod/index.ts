// #region imports
    // #region external
    import {
        InputGetAnalyticsLastPeriod,
        Context,
    } from '~server/data/interfaces';

    import {
        generateMethodLogs,
    } from '~server/utilities';

    import {
        analyticsLastPeriod,
    } from '~server/logic/operators/analytics';
    // #endregion external
// #endregion imports



// #region module
export const getAnalyticsLastPeriodLogs = generateMethodLogs('getAnalyticsLastPeriod');

const getAnalyticsLastPeriod = async (
    input: InputGetAnalyticsLastPeriod,
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
        getAnalyticsLastPeriodLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region private usage
        if (privateUsage) {
            logger.log(
                getAnalyticsLastPeriodLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    getAnalyticsLastPeriodLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const result = await analyticsLastPeriod(
                input,
                privateOwnerIdentonym,
            );

            logger.log(
                getAnalyticsLastPeriodLogs.infoSuccessPrivateUsage,
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
                getAnalyticsLastPeriodLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const result = await analyticsLastPeriod(
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
            getAnalyticsLastPeriodLogs.infoSuccessCustomLogicUsage,
            logLevels.info,
        );

        const result = await analyticsLastPeriod(
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
            getAnalyticsLastPeriodLogs.errorEnd,
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
export default getAnalyticsLastPeriod;
// #endregion exports
