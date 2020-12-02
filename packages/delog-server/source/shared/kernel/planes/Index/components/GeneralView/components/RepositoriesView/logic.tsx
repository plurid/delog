// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Repository,
    } from '~server/data/interfaces';

    import {
        PluridLinkButton,
    } from '~kernel-services/styled';
    // #endregion external
// #endregion imports



// #region module
export const repositoryRowRenderer = (
    repository: Repository,
    unlinkRepository: any,
) => {
    const {
        id,
        name,
    } = repository;

    return (
        <>
            <div>
                <PluridLinkButton
                    text={name}
                    atClick={() => {}}
                    inline={true}
                    style={{
                        border: 'none',
                        fontWeight: 'normal',
                    }}
                />
            </div>

            <PluridIconDelete
                atClick={() => unlinkRepository(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    repositories: Repository[],
) => {
    const searchTerms = repositories.map(
        repository => {
            const {
                id,
                name,
            } = repository;

            const searchTerm = {
                id,
                data: [
                    name.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
