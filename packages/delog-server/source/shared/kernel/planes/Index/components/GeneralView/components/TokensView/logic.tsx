// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        ClientToken,
    } from '~server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const tokenRowRenderer = (
    token: ClientToken,
    handleTokenObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
        name,
        startsWith,
    } = token;

    return (
        <>
            <div>
                {name}
            </div>

            <div>
                {startsWith}
            </div>

            <PluridIconDelete
                atClick={() => handleTokenObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    tokens: ClientToken[],
) => {
    const searchTerms = tokens.map(
        token => {
            const {
                id,
                name,
                startsWith,
            } = token;

            const searchTerm = {
                id,
                data: [
                    name.toLowerCase(),
                    startsWith.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
