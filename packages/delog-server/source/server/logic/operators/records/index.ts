// #region imports
    // #region libraries
    import path from 'path';

    import {
        uuid,
    } from '@plurid/plurid-functions';

    import {
        DelogInputRecordContextRepository,
    } from '@plurid/delog';
    // #endregion libraries


    // #region external
    import {
        Record,
        LoggedRecord,
        InputObliterateRecords,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
    import storage from '~server/services/storage';
    import recordsBatcher from '~server/services/recordsBatcher';
    import tester from '~server/services/tester';

    import Formatter from '~server/objects/Formatter';
    import Notifier from '~server/objects/Notifier';
    // #endregion external
// #endregion imports



// #region module
const getRepositoryRootFilenames = async (
    repository: DelogInputRecordContextRepository,
) => {
    const {
        provider,
        name,
        // branch,
        // commit,
    } = repository;

    const repositoryDirectory = '/data/repositories/'
        + provider + '/'
        + name + '/root/';

    const files: string[] = await storage.readDirectory(
        repositoryDirectory,
    );

    return files;
}

const assembleRecord = async (
    id: string,
    data: any,
) => {
    const record: Record = {
        id,
        ...data,
    };

    if (record.context?.call) {
        const {
            call,
        } = record.context;

        const {
            caller,
            repository,
        } = call;

        const {
            file,
        } = caller;

        const {
            basePath,
        } = repository;

        if (basePath === '__MATCH_CUT__') {
            // Read the paths from the repository base.
            const repositoryBaseFiles = await getRepositoryRootFilenames(
                repository,
            );

            // Check if an element of the caller's filepath matches
            // with an element from the repository
            // TODO: check in depth.
            const fileSplit = file.split(path.sep);

            let matchIndex = -1;

            for (const [index, value] of fileSplit.entries()) {
                let broke = false;

                for (const repositoryBaseFile of repositoryBaseFiles) {
                    if (value === repositoryBaseFile) {
                        broke = true;
                        matchIndex = index;
                        break;
                    }
                }

                if (broke) {
                    break;
                }
            }

            if (matchIndex !== -1) {
                const updatedFile = fileSplit
                    .slice(matchIndex)
                    .join(path.sep);

                record.context.call.caller.file = updatedFile;
            }
        }
    }

    return record;
}

const registerRecord = async (
    data: any,
) => {
    const id = uuid.generate();

    const record: Record = await assembleRecord(
        id,
        data,
    );

    const formatter = new Formatter(record);
    const log = formatter.format();

    const loggedRecord: LoggedRecord = {
        ...record,
        log,
    };

    const notifier = new Notifier({
        type: 'record',
        data: loggedRecord,
    });
    notifier.notify();

    tester.test(loggedRecord);

    recordsBatcher.push(
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
            {
                id,
            },
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
