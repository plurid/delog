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
        Project,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const projectRowRenderer = (
    project: Project,
    handleProjectObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
        name
    } = project;

    return (
        <>
            <div>
                <PluridIconCopy
                    atClick={() => clipboard.copy(id)}
                    style={{
                        marginRight: '1rem',
                    }}
                />

                {id}
            </div>

            <div>
                {name}
            </div>

            <PluridIconDelete
                atClick={() => handleProjectObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    projects: Project[],
) => {
    const searchTerms = projects.map(
        project => {
            const {
                id,
                name,
            } = project;

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
