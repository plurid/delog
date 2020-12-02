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
    } from '~server/data/interfaces';
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
        identifier,
        transform,
    } = format;

    return (
        <>
            <div>
                {identifier}
            </div>

            <div>
                {transform}
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
                identifier,
                transform,
            } = format;

            const searchTerm = {
                id,
                data: [
                    identifier.toLowerCase(),
                    transform.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
