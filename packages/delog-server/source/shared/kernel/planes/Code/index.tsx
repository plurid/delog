// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import { AnyAction } from 'redux';
    import { connect } from 'react-redux';
    import { ThunkDispatch } from 'redux-thunk';

    import Editor from 'react-ace';

    import * as ace from 'ace-builds';
    import 'ace-builds/src-noconflict/mode-text';
    import 'ace-builds/src-noconflict/theme-github';

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

    import {
        getCode,
    } from '#kernel-services/logic/queries';

    import { AppState } from '#kernel-services/state/store';
    import selectors from '#kernel-services/state/selectors';
    // import actions from '#kernel-services/state/actions';
    // #endregion external


    // #region internal
    import {
        StyledCode,
        StyledCodeLocation,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
// HACK: Ace Editor hack to prevent mode/theme lookup bug.
ace.config.set('basePath', '');

export interface CodeOwnProperties {
    plurid: PluridComponentProperty;
}

export interface CodeStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateRecords: LoggedRecord[];
    stateCode: Record<string, string[]>;
}

export interface CodeDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
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
        stateGeneralTheme,
        // stateInteractionTheme,
        stateRecords,
        stateCode,
        // #endregion state

        // #region dispatch
        dispatch,
        // #endregion dispatch
    } = properties;

    const {
        id,
    } = plurid.route.plane.parameters;

    const record = stateRecords.find(record => record.id === id);
    // #endregion properties


    // #region state
    const [
        code,
        setCode,
    ] = useState(stateCode[id]);
    // #endregion state


    // #region effects
    useEffect(() => {
        if (!record) {
            return;
        }

        if (Array.isArray(code)) {
            return;
        }

        const loadCode = async () => {
            const call = record.context?.call;

            if (!call) {
                return;
            }

            const {
                repository,
                caller,
            } = call;

            const {
                provider,
                name,
                branch,
                commit,
            } = repository;

            const {
                file,
                line,
                column,
            } = caller;

            const lines = await getCode(
                dispatch,
                {
                    id,
                    repository: {
                        provider,
                        name,
                        branch,
                        commit,
                    },
                    context: {
                        file,
                        line,
                        column,
                    },
                },
            );

            if (!lines) {
                return;
            }

            setCode(lines);
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

    const call = record.context?.call;
    const repository = call?.repository;

    const annotations: any[] | undefined = call
        ? [
            {
                row: call.caller.line,
                column: call.caller.column,
                type: 'info',
            },
        ] : undefined;

    return (
        <StyledCode
            theme={stateGeneralTheme}
        >
            {repository && (
                <StyledCodeLocation>
                    {repository?.name} // {call?.caller.file}
                </StyledCodeLocation>
            )}

            {Array.isArray(code) && (
                <Editor
                    mode="text"
                    theme="github"
                    onChange={() => {}}
                    name={'code' + id}
                    // editorProps={{ $blockScrolling: true }}
                    fontSize={18}
                    showGutter={true}
                    readOnly={true}
                    width="100%"
                    value={code.join('\n')}

                    annotations={annotations}
                    className="code-editor"
                />
            )}
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
    stateCode: selectors.data.getCode(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): CodeDispatchProperties => ({
    dispatch,
});


const ConnectedCode = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(Code);
// #endregion module



// #region exports
export default ConnectedCode;
// #endregion exports
