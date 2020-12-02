// #region imports
    // #region libraries
    import React, {
        useRef,
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

    import {
        DelogInputRecordContextCall,
    } from '@plurid/delog';
    // #endregion libraries


    // #region external
    import {
        LoggedRecord,
    } from '~server/data/interfaces';

    import {
        getCode,
    } from '~kernel-services/logic/queries';

    import { AppState } from '~kernel-services/state/store';
    import selectors from '~kernel-services/state/selectors';
    // import actions from '~kernel-services/state/actions';
    // #endregion external


    // #region internal
    import {
        StyledCode,
        StyledCodeLocation,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
const resolveRepositoryLinks = (
    call?: DelogInputRecordContextCall,
) => {
    if (!call) {
        return {
            repositoryLink: '',
            fileLink: '',
            lineLink: '',
        };
    }

    const {
        repository,
        caller,
    } = call;

    const {
        provider,
        name,
    } = repository;

    const {
        file,
        line,
    } = caller;

    const https = 'https://';
    let repositoryLink = '';
    let fileLink = '';
    let lineLink = '';

    switch (provider) {
        case 'github':
            repositoryLink = https + 'github.com/' + name;
            fileLink = repositoryLink + '/blob/master/' + file;
            lineLink = fileLink + '#L' + line;
            break;
    }

    return {
        repositoryLink,
        fileLink,
        lineLink,
    };
}

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


    // #region references
    const editorRef = useRef<any | null>(null);
    // #endregion references


    // #region state
    const [
        editor,
        setEditor,
    ] = useState((<></>));

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
            if (typeof window === 'undefined') {
                return;
            }

            const Editor = (await import('react-ace')).default;

            const ace = (await import('ace-builds'));
            await import('ace-builds/src-noconflict/mode-text');
            await import('ace-builds/src-noconflict/theme-github');
            ace.config.set('basePath', '');


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

            const annotations: any[] | undefined = call
                ? [
                    {
                        row: call.caller.line,
                        column: call.caller.column,
                        type: 'info',
                    },
                ] : undefined;

            const editor = (
                <Editor
                    ref={editorRef}
                    mode="text"
                    theme="github"
                    onChange={() => {}}
                    name={'code-123'}
                    editorProps={{
                        // $blockScrolling: true,
                    }}
                    setOptions={{
                        copyWithEmptySelection: true,
                        displayIndentGuides: false,
                        printMargin: false,
                        useSoftTabs: true,
                    }}
                    tabSize={4}
                    fontSize={18}
                    showGutter={true}
                    readOnly={true}
                    width="100%"
                    // height="400px"

                    value={lines.join('\n')}

                    annotations={annotations}
                    className="code-editor"
                />
            );

            setEditor(editor);
            setCode(lines);
        }

        loadCode();
    }, [
        record,
    ]);

    useEffect(() => {
        if (editorRef.current) {
            const caller = record?.context?.call?.caller;

            if (!caller) {
                return;
            }

            const {
                line,
                column,
            } = caller;

            editorRef.current.editor.gotoLine(line, column, false);
        }
    }, [
        record,
        code,
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

    const {
        repositoryLink,
        fileLink,
        lineLink,
    } = resolveRepositoryLinks(call);

    return (
        <StyledCode
            theme={stateGeneralTheme}
        >
            {repository && (
                <StyledCodeLocation
                    theme={stateGeneralTheme}
                >
                    <a
                        href={repositoryLink}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {repository?.name}
                    </a>
                    &nbsp;//&nbsp;
                    <a
                        href={fileLink}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {call?.caller.file}
                    </a>
                    &nbsp;::&nbsp;
                    <a
                        href={lineLink}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        L{call?.caller.line}
                    </a>
                </StyledCodeLocation>
            )}

            {Array.isArray(code) && (
                <>
                    {editor}
                </>
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
