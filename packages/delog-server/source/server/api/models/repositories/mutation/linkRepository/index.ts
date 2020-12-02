// #region imports
    // #region external
    import {
        Context,
        InputLinkRepository,
    } from '~server/data/interfaces';

    import {
        handleLinkRepository,
    } from '~server/api/requesters';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const linkRepositoryLogs = generateMethodLogs('linkRepository');


const linkRepository = async (
    input: InputLinkRepository,
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
        linkRepositoryLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region private usage
        if (privateUsage) {
            logger.log(
                linkRepositoryLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    linkRepositoryLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const repository = await handleLinkRepository(
                input,
                privateOwnerIdentonym,
            );

            if (!repository) {
                logger.log(
                    linkRepositoryLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            logger.log(
                linkRepositoryLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: repository,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                linkRepositoryLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const repository = await handleLinkRepository(
                input,
                '',
            );

            if (!repository) {
                logger.log(
                    linkRepositoryLogs.infoEndCustomLogicUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            logger.log(
                linkRepositoryLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: repository,
            };
        }
        // #endregion logic usage


        // #region public usage
        const repository = await handleLinkRepository(
            input,
            '',
        );

        if (!repository) {
            logger.log(
                linkRepositoryLogs.infoEnd,
                logLevels.info,
            );

            return {
                status: false,
            };
        }

        logger.log(
            linkRepositoryLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
            data: repository,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            linkRepositoryLogs.errorEnd,
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
export default linkRepository;
// #endregion exports
