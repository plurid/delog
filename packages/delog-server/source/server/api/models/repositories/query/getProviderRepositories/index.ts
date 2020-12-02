// #region imports
    // #region external
    import {
        Context,
        InputValueString,
    } from '~server/data/interfaces';

    import {
        getRepositoriesData,
    } from '~server/api/requesters';

    import {
        compareValues,
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const getProviderRepositoriesLogs = generateMethodLogs('getProviderRepositories');


export const getSortedRepositories = async (
    providerID: string,
    ownedBy: string,
) => {
    const repositories = await getRepositoriesData(
        providerID,
        ownedBy,
    );

    if (!repositories) {
        return;
    }

    const sortedRepositories = repositories.sort(compareValues('name'));

    return sortedRepositories;
}

const getProviderRepositories = async (
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
        getProviderRepositoriesLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region input unpack
        const {
            value: providerID,
        } = input;
        // #endregion input unpack


        // #region private usage
        if (privateUsage) {
            logger.log(
                getProviderRepositoriesLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    getProviderRepositoriesLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const sortedRepositories = await getSortedRepositories(
                providerID,
                privateOwnerIdentonym,
            );

            if (!sortedRepositories) {
                logger.log(
                    getProviderRepositoriesLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                }
            }

            logger.log(
                getProviderRepositoriesLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: [
                    ...sortedRepositories,
                ],
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                getProviderRepositoriesLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const sortedRepositories = await getSortedRepositories(
                providerID,
                '',
            );

            if (!sortedRepositories) {
                logger.log(
                    getProviderRepositoriesLogs.infoEndCustomLogicUsage,
                    logLevels.trace,
                );

                return {
                    status: false,
                }
            }

            logger.log(
                getProviderRepositoriesLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: [
                    ...sortedRepositories,
                ],
            };
        }
        // #endregion logic usage


        // #region public usage
        const sortedRepositories = await getSortedRepositories(
            providerID,
            '',
        );

        if (!sortedRepositories) {
            logger.log(
                getProviderRepositoriesLogs.infoEnd,
                logLevels.info,
            );

            return {
                status: false,
            }
        }


        logger.log(
            getProviderRepositoriesLogs.infoSuccess,
            logLevels.info,
        );


        return {
            status: true,
            data: [
                ...sortedRepositories,
            ],
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            getProviderRepositoriesLogs.errorEnd,
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
export default getProviderRepositories;
// #endregion exports
