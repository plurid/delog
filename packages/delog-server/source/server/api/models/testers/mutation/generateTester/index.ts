// #region imports
    // #region external
    import {
        Context,
        InputGenerateTester,
    } from '~server/data/interfaces';

    import {
        registerTester,
    } from '~server/logic/operators/testers';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const generateTesterLogs = generateMethodLogs('generateTester');


const generateTester = async (
    input: InputGenerateTester,
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
        generateTesterLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region input unpack
        const {
            id,
            name,
            project,
            suite,
            scenario,
            configuration,
        } = input;
        // #endregion input unpack


        const data: any = {
            id,
            name,
            project,
            suite,
            scenario,
            configuration,
        };


        // #region private usage
        if (privateUsage) {
            logger.log(
                generateTesterLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    generateTesterLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const tester = await registerTester(
                data,
                privateOwnerIdentonym,
            );

            logger.log(
                generateTesterLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: tester,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                generateTesterLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const tester = await registerTester(
                data,
                '',
            );

            logger.log(
                generateTesterLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: tester,
            };
        }
        // #endregion logic usage


        // #region public usage
        const tester = await registerTester(
            data,
            '',
        );

        logger.log(
            generateTesterLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
            data: tester,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            generateTesterLogs.errorEnd,
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
export default generateTester;
// #endregion exports
