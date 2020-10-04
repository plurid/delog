// #region imports
    // #region libraries
    import React from 'react';

    import { AnyAction } from 'redux';
    import { connect } from 'react-redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region external
    import { AppState } from '#kernel-services/state/store';
    import selectors from '#kernel-services/state/selectors';
    import actions from '#kernel-services/state/actions';
    // #endregion external
// #endregion imports



// #region module
export interface AnalyticsViewOwnProperties {
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

export interface AnalyticsViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
}

export interface AnalyticsViewDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
}

export type AnalyticsViewProperties = AnalyticsViewOwnProperties
    & AnalyticsViewStateProperties
    & AnalyticsViewDispatchProperties;

const AnalyticsView: React.FC<AnalyticsViewProperties> = (
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
        // #endregion state

        // #region dispatch
        dispatch,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region render
    return (
        <div>

        </div>
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): AnalyticsViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): AnalyticsViewDispatchProperties => ({
    dispatch,
});


const ConnectedAnalyticsView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(AnalyticsView);
// #endregion module



// #region exports
export default ConnectedAnalyticsView;
// #endregion exports
