// #region imports
    // #region external
    import {
        Context,
    } from '#server/data/interfaces';

    import {
        generateMethodLogs,
    } from '#server/utilities';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
export const getTestsLogs = generateMethodLogs('getTests');

const getTests = async (
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
        getTestsLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region private usage
        if (privateUsage) {
            logger.log(
                getTestsLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    getTestsLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const tests = await database.query(
                'tests',
                'ownedBy',
                privateOwnerIdentonym,
            );

            logger.log(
                getTestsLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: [
                    ...tests,
                ],
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                getTestsLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            // const owner = await logic.getCurrentOwner();

            return {
                status: true,
                data: [
                    // ...owner.tests,
                ],
            };
        }
        // #endregion logic usage


        // #region public usage
        logger.log(
            getTestsLogs.infoSuccessCustomLogicUsage,
            logLevels.info,
        );

        return {
            status: true,
            data: [
                // ...tests,
            ],
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            getTestsLogs.errorEnd,
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
export default getTests;
// #endregion exports
