// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        graphql,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Repository as IRepository,
    } from '~server/data/interfaces';

    import client from '~kernel-services/graphql/client';

    import {
        GET_PROVIDER_REPOSITORIES,
    } from '~kernel-services/graphql/query';

    import {
        LINK_REPOSITORY,
    } from '~kernel-services/graphql/mutate';

    import {
        StyledPluridPureButton,
        StyledPluridLinkButton,

        PluridSpinner,
    } from '~kernel-services/styled';
    // #endregion external


    // #region internal
    import RepositoryItem from './components/RepositoryItem';

    import {
        StyledRepository,
        StyledRepositoryWrapper,
        StyledNoRepositories,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface RepositoryProperties {
    // #region required
        // #region values
        theme: Theme;
        providerID: string;
        // #endregion values

        // #region methods
        action: (
            repositories: IRepository[],
        ) => void;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        // #endregion values

        // #region methods
        cancel?: () => void;
        // #endregion methods
    // #endregion optional
}

const Repository: React.FC<RepositoryProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
            providerID,
            // #endregion values

            // #region methods
            action,
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            // #endregion values

            // #region methods
            cancel,
            // #endregion methods
        // #endregion optional
    } = properties;
    // #endregion properties


    // #region state
    const [
        loading,
        setLoading,
    ] = useState(true);
    const [
        providerRepositories,
        setProviderRepositories,
    ] = useState<IRepository[]>([]);
    const [
        selectedRepositories,
        setSelectedRepositories,
    ] = useState<string[]>([]);
    // #endregion state


    // #region handlers
    const linkRepositories = async () => {
        if (
            selectedRepositories.length === 0
            || !providerID
        ) {
            return;
        }

        const repositories: IRepository[] = [];

        setLoading(true);

        for (const selectedRepository of selectedRepositories) {
            const repository = providerRepositories.find(
                repository => repository.id === selectedRepository,
            );

            if (!repository) {
                continue;
            }

            const {
                name,
            } = repository;

            const input = {
                providerID,
                nameWithOwner: name,
            };

            const mutate = await client.mutate({
                mutation: LINK_REPOSITORY,
                variables: {
                    input,
                },
            });

            const response = mutate.data.linkRepository;

            if (!response.status) {
                return;
            }

            const {
                data,
            } = response;

            const cleanData: IRepository = graphql.deleteTypenames(data);
            repositories.push(cleanData);
        }

        setLoading(false);

        return repositories;
    }

    const handleSelect = (
        id: string,
    ) => {
        if (!selectedRepositories.includes(id)) {
            const updated = [
                ...selectedRepositories,
                id,
            ];
            setSelectedRepositories(updated);
            return;
        }

        const updated = selectedRepositories.filter(repository => repository !== id);
        setSelectedRepositories(updated);
        return;
    }

    const handleLinkRepositories = async () => {
        const repositories = await linkRepositories() || [];

        action(repositories);
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const getProviderRepositories = async () => {
            try {
                if (!providerID) {
                    return;
                }

                const input = {
                    value: providerID,
                };

                const query = await client.query({
                    query: GET_PROVIDER_REPOSITORIES,
                    variables: {
                        input,
                    },
                });

                const response = query.data.getProviderRepositories;
                if (!response.status) {
                    setLoading(false);
                    return;
                }

                setProviderRepositories(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                return;
            }
        }

        getProviderRepositories();
    }, [
        providerID,
    ]);
    // #endregion effects


    // #region render
    return (
        <StyledRepository
            theme={theme}
        >
            <StyledRepositoryWrapper>
                <h1>
                    link repositories
                </h1>

                {!providerID
                && (
                    <StyledNoRepositories>
                        no provider
                    </StyledNoRepositories>
                )}

                {providerID
                && loading
                && (
                    <PluridSpinner
                        theme={theme}
                    />
                )}

                {!loading
                && providerRepositories.length === 0
                && (
                    <StyledNoRepositories>
                        no repositories
                    </StyledNoRepositories>
                )}

                {!loading
                && providerRepositories.length > 0
                && (
                    <>
                        <ul>
                            {!loading && providerRepositories.map(repository => {
                                const {
                                    id,
                                } = repository;

                                return (
                                    <RepositoryItem
                                        key={id}
                                        theme={theme}
                                        selected={selectedRepositories.includes(id)}
                                        select={handleSelect}
                                        data={repository}
                                    />
                                );
                            })}
                        </ul>

                        <StyledPluridPureButton
                            text="Link Repositories"
                            atClick={() => handleLinkRepositories()}
                            disabled={selectedRepositories.length === 0}
                            theme={theme}
                            level={2}
                        />
                    </>
                )}

                {(!loading || !providerID)
                && cancel
                && (
                    <StyledPluridLinkButton
                        text="cancel"
                        atClick={() => cancel()}
                        theme={theme}
                        level={2}
                    />
                )}
            </StyledRepositoryWrapper>
        </StyledRepository>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Repository;
// #endregion exports
