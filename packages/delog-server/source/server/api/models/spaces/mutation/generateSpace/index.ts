// #region imports
    // #region external
    import {
        Context,
        InputGenerateSpace,
    } from '~server/data/interfaces';

    import {
        registerSpace,
    } from '~server/logic/operators/spaces';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const generateSpaceLogs = generateMethodLogs('generateSpace');


const generateSpace = async (
    input: InputGenerateSpace,
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
        generateSpaceLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region input unpack
        const {
            name,
            project,
        } = input;
        // #endregion input unpack


        const data = {
            name,
            project,
        };


        // #region private usage
        if (privateUsage) {
            logger.log(
                generateSpaceLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    generateSpaceLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const space = await registerSpace(
                data,
                privateOwnerIdentonym,
            );

            logger.log(
                generateSpaceLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: space,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                generateSpaceLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const space = await registerSpace(
                data,
                '',
            );

            logger.log(
                generateSpaceLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: space,
            };
        }
        // #endregion logic usage


        // #region public usage
        const space = await registerSpace(
            data,
            '',
        );

        logger.log(
            generateSpaceLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
            data: space,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            generateSpaceLogs.errorEnd,
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
export default generateSpace;
// #endregion exports
