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
    } from '~server/data/interfaces';

    import {
        PluridCopyableLine,
    } from '~kernel-services/styled';
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
        project,
    } = space;

    return (
        <>
            <PluridCopyableLine
                data={id}
            />

            <div>
                {name}
            </div>

            <div>
                {project}
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
                project,
            } = space;

            const searchTerm = {
                id,
                data: [
                    id.toLowerCase(),
                    name.toLowerCase(),
                    project.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
