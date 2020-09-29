// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Record,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const recordRowRenderer = (
    record: Record,
    handleRecordObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
        text,
    } = record;

    return (
        <>
            <div>
                {text}
            </div>

            <PluridIconDelete
                atClick={() => handleRecordObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    records: Record[],
) => {
    const searchTerms = records.map(
        record => {
            const {
                id,
                text,
            } = record;

            const searchTerm = {
                id,
                data: [
                    text.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
