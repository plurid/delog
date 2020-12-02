// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import { AnyAction } from 'redux';
    import { connect } from 'react-redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region external
    import {
        compareValues,
    } from '~server/utilities/general';

    import {
        Repository,
    } from '~server/data/interfaces';

    import EntityView from '~kernel-components/EntityView';

    import client from '~kernel-services/graphql/client';

    import {
        DELINK_REPOSITORY,
    } from '~kernel-services/graphql/mutate';

    import {
        getCurrentOwner,
    } from '~kernel-services/logic/queries';

    import { AppState } from '~kernel-services/state/store';
    import selectors from '~kernel-services/state/selectors';
    import actions from '~kernel-services/state/actions';

    import {
        getFilterIDs,
    } from '~kernel-services/utilities';
    // #endregion external


    // #region imports
    import {
        repositoryRowRenderer,
        createSearchTerms,
    } from './logic';
    // #endregion imports
// #endregion imports



// #region module
export interface RepositoriesViewOwnProperties {
    // #region required
        // #region values
        // #endregion values

        // #region methods
        setGeneralView: any;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        // #endregion values

        // #region methods
        // #endregion methods
    // #endregion optional
}

export interface RepositoriesViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateRepositories: Repository[];
}

export interface RepositoriesViewDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    dispatchRemoveEntity: typeof actions.data.removeEntity;
}

export type RepositoriesViewProperties = RepositoriesViewOwnProperties
    & RepositoriesViewStateProperties
    & RepositoriesViewDispatchProperties;

const RepositoriesView: React.FC<RepositoriesViewProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            // #endregion values

            // #region methods
            setGeneralView,
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            // #endregion values

            // #region methods
            // #endregion methods
        // #endregion optional

        // #region state
        stateGeneralTheme,
        stateInteractionTheme,
        stateRepositories,
        // #endregion state

        // #region dispatch
        dispatch,
        dispatchRemoveEntity,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region handlers
    const unlinkRepository = async (
        id: string,
    ) => {
        try {
            dispatchRemoveEntity({
                type: 'repository',
                id,
            });

            const input = {
                value: id,
            };

            await client.mutate({
                mutation: DELINK_REPOSITORY,
                variables: {
                    input,
                },
            });
        } catch (error) {
            return;
        }
    }
    // #endregion handlers


    // #region state
    const [searchTerms, setSearchTerms] = useState(
        createSearchTerms(stateRepositories),
    );

    const [filteredRows, setFilteredRows] = useState(
        stateRepositories.map(
            repository => repositoryRowRenderer(
                repository,
                unlinkRepository,
            ),
        ),
    );
    // #endregion state


    // #region handlers
    const filterUpdate = (
        rawValue: string,
    ) => {
        const value = rawValue.toLowerCase();

        const filterIDs = getFilterIDs(
            searchTerms,
            value,
        );

        const filteredRepositories = stateRepositories.filter(stateRepository => {
            if (filterIDs.includes(stateRepository.id)) {
                return true;
            }

            return false;
        });

        const sortedRepositories = filteredRepositories.sort(
            compareValues('name'),
        );

        setFilteredRows(
            sortedRepositories.map(
                repository => repositoryRowRenderer(
                    repository,
                    unlinkRepository,
                ),
            ),
        );
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const searchTerms = createSearchTerms(
            stateRepositories,
        );
        const filteredRows = stateRepositories.map(
            repository => repositoryRowRenderer(
                repository,
                unlinkRepository,
            ),
        );

        setSearchTerms(searchTerms);
        setFilteredRows(filteredRows);
    }, [
        stateRepositories,
    ]);
    // #endregion effects


    // #region render
    const rowsHeader = (
        <>
            <div>
                name
            </div>

            <div />
        </>
    );

    return (
        <EntityView
            generalTheme={stateGeneralTheme}
            interactionTheme={stateInteractionTheme}

            rowTemplate="4fr 30px"
            rowsHeader={rowsHeader}
            rows={filteredRows}
            noRows="no repositories"

            actionButtonText="Link Repositories"
            actionButtonClick={() => {
                setGeneralView('link-repositories');
            }}

            filterUpdate={filterUpdate}
            refresh={() => {
                getCurrentOwner(dispatch);
            }}
        />
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): RepositoriesViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateRepositories: selectors.data.getRepositories(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): RepositoriesViewDispatchProperties => ({
    dispatch,
    dispatchRemoveEntity: (
        payload,
    ) => dispatch (
        actions.data.removeEntity(payload),
    ),
});


const ConnectedRepositoriesView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(RepositoriesView);
// #endregion module



// #region exports
export default ConnectedRepositoriesView;
// #endregion exports
