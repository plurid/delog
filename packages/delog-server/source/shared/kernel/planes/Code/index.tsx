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

    import {
        PluridComponentProperty,
    } from '@plurid/plurid-react';
    // #endregion libraries


    // #region external
    import {
        LoggedRecord,
    } from '#server/data/interfaces';

    import { AppState } from '#kernel-services/state/store';
    import selectors from '#kernel-services/state/selectors';
    // import actions from '#kernel-services/state/actions';
    // #endregion external


    // #region internal
    import {
        StyledCode,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface CodeOwnProperties {
    plurid: PluridComponentProperty;
}

export interface CodeStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateRecords: LoggedRecord[];
}

export interface CodeDispatchProperties {
}

export type CodeProperties = CodeOwnProperties
    & CodeStateProperties
    & CodeDispatchProperties;

const Code: React.FC<CodeProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region own
        plurid,
        // #endregion own

        // #region state
        // stateGeneralTheme,
        // stateInteractionTheme,
        stateRecords,
        // #endregion state
    } = properties;

    const {
        id,
    } = plurid.route.plane.parameters;

    const record = stateRecords.find(record => record.id === id);
    // #endregion properties


    // #region effects
    useEffect(() => {
        if (!record) {
            return;
        }

        const loadCode = async () => {
            const call = record.context?.call;

            if (!call) {
                return;
            }

            const {
                caller,
                repository,
            } = call;
        }

        loadCode();
    }, [
        record,
    ]);
    // #endregion effects


    // #region render
    if (!record) {
        return (
            <></>
        );
    }

    return (
        <StyledCode>
            {id}
        </StyledCode>
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): CodeStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateRecords: selectors.data.getRecords(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): CodeDispatchProperties => ({
});


const ConnectedCode = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(Code);
// #endregion module



// #region exports
export default ConnectedCode;
// #endregion exports
