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
    } from '#server/utilities/general';

    import {
        ClientNotifier,
    } from '#server/data/interfaces';

    import EntityView from '#kernel-components/EntityView';

    import client from '#kernel-services/graphql/client';

    import {
        OBLITERATE_NOTIFIER,
    } from '#kernel-services/graphql/mutate';

    import {
        getCurrentOwner,
    } from '#kernel-services/logic/queries';

    import { AppState } from '#kernel-services/state/store';
    import selectors from '#kernel-services/state/selectors';
    import actions from '#kernel-services/state/actions';

    import {
        getFilterIDs,
    } from '#kernel-services/utilities';
    // #endregion external


    // #region internal
    import {
        notifierRowRenderer,
        createSearchTerms,
    } from './logic';
    // #endregion internal
// #endregion imports



// #region module
export interface NotifiersViewOwnProperties {
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

export interface NotifiersViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateNotifiers: ClientNotifier[];
}

export interface NotifiersViewDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    dispatchRemoveEntity: typeof actions.data.removeEntity;
}

export type NotifiersViewProperties = NotifiersViewOwnProperties
    & NotifiersViewStateProperties
    & NotifiersViewDispatchProperties;

const NotifiersView: React.FC<NotifiersViewProperties> = (
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
        stateNotifiers,
        // #endregion state

        // #region dispatch
        dispatch,
        dispatchRemoveEntity,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region handlers
    const handleNotifierObliterate = async (
        id: string,
    ) => {
        try {
            dispatchRemoveEntity({
                type: 'notifier',
                id,
            });

            const input = {
                value: id,
            };

            await client.mutate({
                mutation: OBLITERATE_NOTIFIER,
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
        createSearchTerms(stateNotifiers),
    );

    const [filteredRows, setFilteredRows] = useState(
        stateNotifiers.map(
            notifier => notifierRowRenderer(
                notifier,
                handleNotifierObliterate,
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

        const filteredNotifiers = stateNotifiers.filter(stateNotifier => {
            if (filterIDs.includes(stateNotifier.id)) {
                return true;
            }

            return false;
        });

        const sortedNotifiers = filteredNotifiers.sort(
            compareValues('name'),
        );

        setFilteredRows(
            sortedNotifiers.map(
                notifier => notifierRowRenderer(
                    notifier,
                    handleNotifierObliterate,
                ),
            ),
        );
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const searchTerms = createSearchTerms(
            stateNotifiers,
        );
        const filteredRows = stateNotifiers.map(
            notifier => notifierRowRenderer(
                notifier,
                handleNotifierObliterate,
            ),
        );

        setSearchTerms(searchTerms);
        setFilteredRows(filteredRows);
    }, [
        stateNotifiers,
    ]);
    // #endregion effects


    // #region render
    const rowsHeader = (
        <>
            <div>
                type
            </div>

            <div>
                name
            </div>

            <div>
                notify on
            </div>

            <div>
                details
            </div>

            <div />
        </>
    );

    return (
        <EntityView
            generalTheme={stateGeneralTheme}
            interactionTheme={stateInteractionTheme}

            rowTemplate="90px 1fr 2fr 3fr 30px"
            rowsHeader={rowsHeader}
            rows={filteredRows}
            noRows="no notifiers"

            actionButtonText="Generate Notifier"
            actionButtonClick={() => {
                setGeneralView('generate-notifier');
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
): NotifiersViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateNotifiers: selectors.data.getNotifiers(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): NotifiersViewDispatchProperties => ({
    dispatch,
    dispatchRemoveEntity: (
        payload,
    ) => dispatch (
        actions.data.removeEntity(payload),
    ),
});


const ConnectedNotifiersView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(NotifiersView);
// #endregion module



// #region exports
export default ConnectedNotifiersView;
// #endregion exports
