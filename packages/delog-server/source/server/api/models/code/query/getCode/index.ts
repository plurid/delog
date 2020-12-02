// #region imports
    // #region external
    import {
        Context,
        InputGetCode,
    } from '~server/data/interfaces';

    import {
        getCodeLines,
    } from '~server/logic/operators/code';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const getCodeLogs = generateMethodLogs('getCode');

const getCode = async (
    input: InputGetCode,
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
        getCodeLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region private usage
        if (privateUsage) {
            logger.log(
                getCodeLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    getCodeLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const lines = await getCodeLines(
                input,
            );

            logger.log(
                getCodeLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: {
                    lines: [
                        ...lines,
                    ],
                },
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                getCodeLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            return {
                status: true,
                data: {
                    lines: [],
                },
            };
        }
        // #endregion logic usage


        // #region public usage
        logger.log(
            getCodeLogs.infoSuccessCustomLogicUsage,
            logLevels.info,
        );

        return {
            status: true,
            data: {
                lines: [],
            },
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            getCodeLogs.errorEnd,
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
export default getCode;
// #endregion exports
