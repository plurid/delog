// #region imports
    // #region external
    import {
        Context,
        InputGenerateToken,
    } from '~server/data/interfaces';

    import {
        registerToken,
    } from '~server/logic/operators/tokens';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const generateTokenLogs = generateMethodLogs('generateToken');


const generateToken = async (
    input: InputGenerateToken,
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
        generateTokenLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region input unpack
        const {
            name,
        } = input;
        // #endregion input unpack


        // #region private usage
        if (privateUsage) {
            logger.log(
                generateTokenLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    generateTokenLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const token = await registerToken(
                name,
                privateOwnerIdentonym,
            );

            logger.log(
                generateTokenLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: token,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                generateTokenLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const token = await registerToken(
                name,
                '',
            );

            logger.log(
                generateTokenLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: token,
            };
        }
        // #endregion logic usage


        // #region public usage
        const token = await registerToken(
            name,
            '',
        );

        logger.log(
            generateTokenLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
            data: token,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            generateTokenLogs.errorEnd,
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
export default generateToken;
// #endregion exports
