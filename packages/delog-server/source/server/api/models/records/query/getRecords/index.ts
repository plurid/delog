// #region imports
    // #region external
    import {
        Context,
        InputQuery,
    } from '~server/data/interfaces';

    import {
        generateMethodLogs,
    } from '~server/utilities';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
export const getRecordsLogs = generateMethodLogs('getRecords');

const getRecords = async (
    input: InputQuery | undefined,
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
        getRecordsLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        const count = input?.count || 20;
        const start = input?.start;


        // #region private usage
        if (privateUsage) {
            logger.log(
                getRecordsLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    getRecordsLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            logger.log(
                getRecordsLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            const records = await database.query(
                'records',
                'ownedBy',
                privateOwnerIdentonym,
                {
                    count,
                    type: 'last',
                    start,
                },
            );


            const sortedRecords = records.sort((a: any, b: any) => {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return (new Date(b.time * 1000) as any) - (new Date(a.time * 1000) as any);
            });

            return {
                status: true,
                data: [
                    ...sortedRecords,
                ],
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                getRecordsLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const owner = await logic.getCurrentOwner();

            return {
                status: true,
                data: [
                    // ...owner.,
                ],
            };
        }
        // #endregion logic usage


        // #region public usage
        logger.log(
            getRecordsLogs.infoSuccessCustomLogicUsage,
            logLevels.info,
        );

        return {
            status: true,
            data: [
                ...[],
            ],
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            getRecordsLogs.errorEnd,
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
export default getRecords;
// #endregion exports
