// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Space,
    } from '#server/data/interfaces';

    import CopyableField from '#kernel-components/CopyableField';
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
            <CopyableField
                data={id}
            />

            <div>
                {name}
            </div>

            <div>
                project
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
