// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Record,
        LoggedRecord,
        InputObliterateRecords,
    } from '#server/data/interfaces';

    import database from '#server/services/database';

    import Formatter from '#server/objects/Formatter';
    import Notifier from '#server/objects/Notifier';
    // #endregion external
// #endregion imports



// #region module
const registerRecord = async (
    data: any,
) => {
    const id = uuid.generate();

    const record: Record = {
        id,
        ...data,
    };

    const formatter = new Formatter(record);

    const log = formatter.format();

    const loggedRecord: LoggedRecord = {
        ...record,
        log,
    };

    const notifier = new Notifier(loggedRecord);
    notifier.notify();

    await database.store(
        'records',
        id,
        loggedRecord,
    );

    return record;
}


const deregisterRecord = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'records',
            id,
        );
    } catch (error) {
        return;
    }
}


const deregisterRecords = async (
    ownedBy: string,
    data?: InputObliterateRecords,
) => {
    try {
        if (!data) {
            await database.obliterateAll(
                'records',
                {
                    ownedBy,
                },
            );

            return;
        }

        const {
            // filter,
            ids,
        } = data;

        if (ids) {
            for (const id of ids) {
                deregisterRecord(id);
            }

            return;
        }

        // remove based on filter
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    registerRecord,
    deregisterRecord,
    deregisterRecords,
};
// #endregion exports
