// #region imports
    // #region external
    import {
        Context,
        InputValueString,
    } from '#server/data/interfaces';

    import {
        registerFormat,
    } from '#server/logic/operators/formats';

    import {
        generateMethodLogs,
    } from '#server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const generateFormatLogs = generateMethodLogs('generateFormat');


const generateFormat = async (
    input: InputValueString,
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
        generateFormatLogs.infoStart,
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
                generateFormatLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    generateFormatLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const project = await registerFormat(name);

            logger.log(
                generateFormatLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: project,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                generateFormatLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const project = await registerFormat(name);

            logger.log(
                generateFormatLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: project,
            };
        }
        // #endregion logic usage


        // #region public usage
        const project = await registerFormat(name);

        logger.log(
            generateFormatLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
            data: project,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            generateFormatLogs.errorEnd,
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
export default generateFormat;
// #endregion exports
