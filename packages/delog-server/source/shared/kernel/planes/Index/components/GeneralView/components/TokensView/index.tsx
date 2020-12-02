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
        ClientToken,
    } from '~server/data/interfaces';

    import EntityView from '~kernel-components/EntityView';

    import client from '~kernel-services/graphql/client';

    import {
        OBLITERATE_TOKEN,
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
        tokenRowRenderer,
        createSearchTerms,
    } from './logic';
    // #endregion internal
// #endregion imports



// #region module
export interface TokensViewOwnProperties {
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

export interface TokensViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateTokens: ClientToken[];
}

export interface TokensViewDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    dispatchRemoveEntity: typeof actions.data.removeEntity;
}

export type TokensViewProperties = TokensViewOwnProperties
    & TokensViewStateProperties
    & TokensViewDispatchProperties;

const TokensView: React.FC<TokensViewProperties> = (
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
        stateTokens,
        // #endregion state

        // #region dispatch
        dispatch,
        dispatchRemoveEntity,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region handlers
    const handleTokenObliterate = async (
        id: string,
    ) => {
        try {
            dispatchRemoveEntity({
                type: 'token',
                id,
            });

            const input = {
                value: id,
            };

            await client.mutate({
                mutation: OBLITERATE_TOKEN,
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
        createSearchTerms(stateTokens),
    );

    const [filteredRows, setFilteredRows] = useState(
        stateTokens.map(
            token => tokenRowRenderer(
                token,
                handleTokenObliterate,
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

        const filteredTokens = stateTokens.filter(stateToken => {
            if (filterIDs.includes(stateToken.id)) {
                return true;
            }

            return false;
        });

        const sortedTokens = filteredTokens.sort(
            compareValues('name'),
        );

        setFilteredRows(
            sortedTokens.map(
                token => tokenRowRenderer(
                    token,
                    handleTokenObliterate,
                ),
            ),
        );
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const searchTerms = createSearchTerms(
            stateTokens,
        );
        const filteredRows = stateTokens.map(
            token => tokenRowRenderer(
                token,
                handleTokenObliterate,
            ),
        );

        setSearchTerms(searchTerms);
        setFilteredRows(filteredRows);
    }, [
        stateTokens,
    ]);
    // #endregion effects


    // #region render
    const rowsHeader = (
        <>
            <div>
                name
            </div>

            <div>
                starts with
            </div>

            <div />
        </>
    );

    return (
        <EntityView
            generalTheme={stateGeneralTheme}
            interactionTheme={stateInteractionTheme}

            rowTemplate="2fr 240px 30px"
            rowsHeader={rowsHeader}
            rows={filteredRows}
            noRows="no tokens"

            actionButtonText="Generate Token"
            actionButtonClick={() => {
                setGeneralView('generate-token');
            }}

            filterUpdate={filterUpdate}
            refresh={() => {
                getCurrentOwner(dispatch);
            }}
        />
    );
    // #endregion render
}
name

const mapStateToProperties = (
    state: AppState,
): TokensViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateTokens: selectors.data.getTokens(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): TokensViewDispatchProperties => ({
    dispatch,
    dispatchRemoveEntity: (
        payload,
    ) => dispatch (
        actions.data.removeEntity(payload),
    ),
});


const ConnectedTokensView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(TokensView);
// #endregion module



// #region exports
export default ConnectedTokensView;
// #endregion exports
