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
    } = record;

    return (
        <>
            <div>
                {/* {name} */}
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
            } = record;

            const searchTerm = {
                id,
                data: [
                    // name.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module