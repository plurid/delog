// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        logLevelsText,
    } from '#server/data/constants/logger';

    import {
        LoggedRecord,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const recordRowRenderer = (
    record: LoggedRecord,
    handleRecordObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
        project,
        space,
        level,
        log,
    } = record;

    return (
        <>
            <div>
                {project}
            </div>

            <div>
                {space}
            </div>

            <div>
                {logLevelsText[level] || ''}
            </div>

            <div>
                {log}
            </div>

            <PluridIconDelete
                atClick={() => handleRecordObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    records: LoggedRecord[],
) => {
    const searchTerms = records.map(
        record => {
            const {
                id,
                project,
                space,
                level,
                log,
            } = record;

            const levelText = logLevelsText[level] || '';

            const searchTerm = {
                id,
                data: [
                    project.toLowerCase(),
                    space.toLowerCase(),
                    levelText,
                    log.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
