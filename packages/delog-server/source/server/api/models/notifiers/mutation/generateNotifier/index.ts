// #region imports
    // #region external
    import {
        Context,
        InputGenerateNotifier,
        ClientNotifier,
        NotifierType,
    } from '~server/data/interfaces';

    import {
        registerNotifier,
    } from '~server/logic/operators/notifiers';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const generateNotifierLogs = generateMethodLogs('generateNotifier');


const generateNotifier = async (
    input: InputGenerateNotifier,
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
        generateNotifierLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region input unpack
        const {
            name,
            notifyOn,
            type,
            data,
        } = input;
        // #endregion input unpack


        const values: any = {
            name,
            notifyOn,
            type: type as NotifierType,
            data: JSON.parse(data),
        };


        // #region private usage
        if (privateUsage) {
            logger.log(
                generateNotifierLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    generateNotifierLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const notifier = await registerNotifier(
                values,
                privateOwnerIdentonym,
            );

            logger.log(
                generateNotifierLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: notifier,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                generateNotifierLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const notifier = await registerNotifier(
                values,
                '',
            );

            logger.log(
                generateNotifierLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: notifier,
            };
        }
        // #endregion logic usage


        // #region public usage
        const notifier = await registerNotifier(
            values,
            '',
        );

        logger.log(
            generateNotifierLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
            data: notifier,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            generateNotifierLogs.errorEnd,
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
export default generateNotifier;
// #endregion exports
