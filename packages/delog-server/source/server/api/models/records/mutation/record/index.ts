// #region imports
    // #region libraries
    import {
        DelogInputRecord,
    } from '@plurid/delog';
    // #endregion libraries


    // #region external
    import {
        Context,
    } from '~server/data/interfaces';

    import {
        registerRecord,
    } from '~server/logic/operators/records';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const recordLogs = generateMethodLogs('record');


const record = async (
    input: DelogInputRecord,
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
        recordLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region input unpack
        const {
            text,
            time,
            level,

            project,
            space,

            format,

            method,
            error,
            extradata,
            context,
        } = input;
        // #endregion input unpack


        const record: any = {
            text,
            time,
            level,

            project,
            space,

            format: format || '%TIME - %SPACE - %LEVEL : %TEXT',

            method,
            error,
            extradata,
            context,
        };


        // #region private usage
        if (privateUsage) {
            logger.log(
                recordLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    recordLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            record.ownedBy = privateOwnerIdentonym;

            await registerRecord(
                record,
            );

            logger.log(
                recordLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.delogLogic;

        if (customLogicUsage && logic) {
            logger.log(
                recordLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            await registerRecord(
                record,
            );

            logger.log(
                recordLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
            };
        }
        // #endregion logic usage


        // #region public usage
        if (!privateOwnerIdentonym) {
            logger.log(
                recordLogs.infoEnd,
                logLevels.info,
            );

            return {
                status: false,
            };
        }

        record.ownedBy = privateOwnerIdentonym;

        await registerRecord(
            record,
        );

        logger.log(
            recordLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            recordLogs.errorEnd,
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
export default record;
// #endregion exports
