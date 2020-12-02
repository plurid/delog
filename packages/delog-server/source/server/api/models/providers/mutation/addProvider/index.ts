// #region imports
    // #region external
    import {
        Context,
        InputAddProvider,
    } from '~server/data/interfaces';

    import {
        registerProvider,
    } from '~server/logic/operators/providers';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const addProviderLogs = generateMethodLogs('addProvider');

const addProvider = async (
    input: InputAddProvider,
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
        addProviderLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region private usage
        if (privateUsage) {
            logger.log(
                addProviderLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    addProviderLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const provider = await registerProvider(
                input,
                privateOwnerIdentonym,
            );

            logger.log(
                addProviderLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: provider,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                addProviderLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const provider = await logic.provider.register(
                input,
            );

            if (!provider) {
                logger.log(
                    addProviderLogs.infoEndCustomLogicUsage,
                    logLevels.trace,
                );

                return {
                    status: false,
                };
            }

            logger.log(
                addProviderLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: provider,
            };
        }
        // #endregion logic usage


        // #region public usage
        const provider = await registerProvider(
            input,
            '',
        );

        logger.log(
            addProviderLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
            data: provider,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            addProviderLogs.errorEnd,
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
export default addProvider;
// #endregion exports
