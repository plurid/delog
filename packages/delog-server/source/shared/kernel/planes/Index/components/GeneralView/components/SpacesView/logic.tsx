// #region imports
    // #region libraries
    import React from 'react';

    import {
        clipboard,
    } from '@plurid/plurid-functions';

    import {
        PluridIconDelete,
        PluridIconCopy,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Space,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const spaceRowRenderer = (
    space: Space,
    handleSpaceObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
        name,
    } = space;

    return (
        <>
            <div>
                {name}
            </div>

            <div>
                <PluridIconCopy
                    atClick={() => clipboard.copy(id)}
                    style={{
                        marginRight: '1rem',
                    }}
                />

                {id}
            </div>

            <PluridIconDelete
                atClick={() => handleSpaceObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    spaces: Space[],
) => {
    const searchTerms = spaces.map(
        space => {
            const {
                id,
                name,
            } = space;

            const searchTerm = {
                id,
                data: [
                    name.toLowerCase(),
                    id.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
