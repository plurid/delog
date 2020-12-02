// #region imports
    // #region external
    import {
        Context,
        InputObliterateRecords,
    } from '~server/data/interfaces';

    import {
        deregisterRecords,
    } from '~server/logic/operators/records';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const clearRecordsLogs = generateMethodLogs('clearRecords');


const clearRecords = async (
    input: InputObliterateRecords,
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
        clearRecordsLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region private usage
        if (privateUsage) {
            logger.log(
                clearRecordsLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    clearRecordsLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            await deregisterRecords(
                privateOwnerIdentonym,
                input,
            );

            logger.log(
                clearRecordsLogs.infoSuccessPrivateUsage,
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
                clearRecordsLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            await deregisterRecords(
                '',
                input,
            );

            logger.log(
                clearRecordsLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
            };
        }
        // #endregion logic usage


        // #region public usage
        await deregisterRecords(
            '',
            input,
        );

        logger.log(
            clearRecordsLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            clearRecordsLogs.errorEnd,
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
export default clearRecords;
// #endregion exports
