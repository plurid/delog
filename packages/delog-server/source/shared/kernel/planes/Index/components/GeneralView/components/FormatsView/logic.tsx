// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Format,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const formatRowRenderer = (
    format: Format,
    handleFormatObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
        value,
    } = format;

    return (
        <>
            <div>
                {value}
            </div>

            <PluridIconDelete
                atClick={() => handleFormatObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    formats: Format[],
) => {
    const searchTerms = formats.map(
        format => {
            const {
                id,
                value,
            } = format;

            const searchTerm = {
                id,
                data: [
                    value.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
