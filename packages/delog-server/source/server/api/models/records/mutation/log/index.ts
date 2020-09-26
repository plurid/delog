// #region imports
    // #region external
    import {
        Context,
    } from '#server/data/interfaces';

    import {
        registerRecord,
    } from '#server/logic/records';

    import {
        generateMethodLogs,
    } from '#server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const logLogs = generateMethodLogs('log');


const log = async (
    input: any,
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
        logLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region input unpack
        const {
            value: name,
        } = input;
        // #endregion input unpack


        // #region private usage
        if (privateUsage) {
            logger.log(
                logLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    logLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            await registerRecord(name);

            logger.log(
                logLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                logLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            await registerRecord(name);

            logger.log(
                logLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
            };
        }
        // #endregion logic usage


        // #region public usage
        await registerRecord(name);

        logger.log(
            logLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            logLogs.errorEnd,
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
export default log;
// #endregion exports
