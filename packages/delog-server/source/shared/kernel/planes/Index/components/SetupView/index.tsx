// #region imports
    // #region libraries
    import React, {
        useState,
    } from 'react';

    import { AnyAction } from 'redux';
    import { connect } from 'react-redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        Theme
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region external
    import Provider from '#kernel-components/Provider';
    import Webhook from '#kernel-components/Webhook';
    import Repositories from '#kernel-components/Repositories';
    import Trigger from '#kernel-components/Trigger';

    import { AppState } from '#kernel-services/state/store';
    import selectors from '#kernel-services/state/selectors';
    import actions from '#kernel-services/state/actions';
    // #endregion external


    // #region internal
    import {
        StyledSetupView,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface SetupViewOwnProperties {
}

export interface SetupViewStateProperties {
    stateInteractionTheme: Theme;
    stateActiveProviderID: string;
}

export interface SetupViewDispatchProperties {
    dispatchSetActiveProviderID: typeof actions.data.setActiveProviderID;
}

export type SetupViewProperties = SetupViewOwnProperties
    & SetupViewStateProperties
    & SetupViewDispatchProperties;

const SetupView: React.FC<SetupViewProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region state
        stateInteractionTheme,
        stateActiveProviderID,
        // #endregion state

        // #region dispatch
        dispatchSetActiveProviderID,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region state
    const [
        phase,
        setPhase,
    ] = useState('PROVIDER');
    // #endregion state


    // #region handlers
    const cancelPhases = () => {
        // setView('general');
    }
    // #endregion handlers


    // #region render
    return (
        <StyledSetupView>
            {phase === 'PROVIDER' && (
                <Provider
                    theme={stateInteractionTheme}
                    action={(
                        provider,
                    ) => {
                        dispatchSetActiveProviderID(provider.id);
                        setPhase('REPOSITORY');
                    }}
                />
            )}

            {phase === 'REPOSITORY' && (
                <Repositories
                    theme={stateInteractionTheme}
                    providerID={stateActiveProviderID}
                    action={() => {
                        setPhase('WEBHOOK');
                    }}
                    cancel={() => cancelPhases()}
                />
            )}

            {phase === 'WEBHOOK' && (
                <Webhook
                    theme={stateInteractionTheme}
                    providerID={stateActiveProviderID}
                    action={() => {
                        setPhase('TRIGGER');
                    }}
                    cancel={() => cancelPhases()}
                />
            )}

            {phase === 'TRIGGER' && (
                <Trigger
                    theme={stateInteractionTheme}
                    providerID={stateActiveProviderID}
                    action={() => {
                        // setView('general');
                    }}
                    cancel={() => cancelPhases()}
                />
            )}
        </StyledSetupView>
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): SetupViewStateProperties => ({
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateActiveProviderID: selectors.data.getActiveProviderID(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): SetupViewDispatchProperties => ({
    dispatchSetActiveProviderID: (
        providerID,
    ) => dispatch(
        actions.data.setActiveProviderID(providerID),
    ),
});


export const ConnectedSetupView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(SetupView);
// #endregion module



// #region exports
export default ConnectedSetupView;
// #endregion exports
