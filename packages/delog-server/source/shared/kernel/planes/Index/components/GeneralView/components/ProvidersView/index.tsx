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
        ClientProvider,
    } from '~server/data/interfaces';

    import EntityView from '~kernel-components/EntityView';

    import client from '~kernel-services/graphql/client';

    import {
        OBLITERATE_PROVIDER,
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


    // #region internal
    import {
        providerRowRenderer,
        createSearchTerms,
    } from './logic';
    // #endregion internal
// #endregion imports




// #region module
export interface ProvidersViewOwnProperties {
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

export interface ProvidersViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateActiveProviderID: string;
    stateProviders: ClientProvider[];
}

export interface ProvidersViewDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    dispatchRemoveEntity: typeof actions.data.removeEntity;
    dispatchSetActiveProviderID: typeof actions.data.setActiveProviderID;
}

export type ProvidersViewProperties = ProvidersViewOwnProperties
    & ProvidersViewStateProperties
    & ProvidersViewDispatchProperties;

const ProvidersView: React.FC<ProvidersViewProperties> = (
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
        stateActiveProviderID,
        stateProviders,
        // #endregion state

        // #region dispatch
        dispatch,
        dispatchRemoveEntity,
        dispatchSetActiveProviderID,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region handlers
    const handleObliterateProvider = async (
        id: string,
    ) => {
        try {
            dispatchRemoveEntity({
                type: 'provider',
                id,
            });

            const input = {
                value: id,
            };

            await client.mutate({
                mutation: OBLITERATE_PROVIDER,
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
        createSearchTerms(stateProviders),
    );

    const [filteredRows, setFilteredRows] = useState(
        stateProviders.map(
            provider => providerRowRenderer(
                provider,
                dispatchSetActiveProviderID,
                stateActiveProviderID,
                handleObliterateProvider,
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

        const filteredProviders = stateProviders.filter(stateProvider => {
            if (filterIDs.includes(stateProvider.id)) {
                return true;
            }

            return false;
        });

        const sortedProviders = filteredProviders.sort(
            compareValues('name'),
        );

        setFilteredRows(
            sortedProviders.map(
                provider => providerRowRenderer(
                    provider,
                    dispatchSetActiveProviderID,
                    stateActiveProviderID,
                    handleObliterateProvider,
                ),
            ),
        );
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const searchTerms = createSearchTerms(
            stateProviders,
        );
        const filteredRows = stateProviders.map(
            provider => providerRowRenderer(
                provider,
                dispatchSetActiveProviderID,
                stateActiveProviderID,
                handleObliterateProvider,
            ),
        );

        setSearchTerms(searchTerms);
        setFilteredRows(filteredRows);
    }, [
        stateProviders,
        stateActiveProviderID,
    ]);
    // #endregion effects


    // #region render
    const rowsHeader = (
        <>
            <div>
                name
            </div>

            <div>
                type
            </div>

            <div />
        </>
    );

    return (
        <EntityView
            generalTheme={stateGeneralTheme}
            interactionTheme={stateInteractionTheme}

            rowTemplate="3fr 1fr 30px"
            rowsHeader={rowsHeader}
            rows={filteredRows}
            noRows="no providers"

            actionButtonText="Add Provider"
            actionButtonClick={() => {
                setGeneralView('add-provider');
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
): ProvidersViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateActiveProviderID: selectors.data.getActiveProviderID(state),
    stateProviders: selectors.data.getProviders(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): ProvidersViewDispatchProperties => ({
    dispatch,
    dispatchRemoveEntity: (
        payload,
    ) => dispatch (
        actions.data.removeEntity(payload),
    ),
    dispatchSetActiveProviderID: (
        id,
    ) => dispatch (
        actions.data.setActiveProviderID(id),
    ),
});


const ConnectedProvidersView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(ProvidersView);
// #endregion module



// #region exports
export default ConnectedProvidersView;
// #endregion exports
