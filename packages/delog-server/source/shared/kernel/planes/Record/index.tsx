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
        PluridLink,
    } from '@plurid/plurid-react';

    import {
        PluridIconInfo,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        logLevelsText,
    } from '#server/data/constants/logger';

    import {
        LoggedRecord,
    } from '#server/data/interfaces';

    import { AppState } from '#kernel-services/state/store';
    import selectors from '#kernel-services/state/selectors';
    // import actions from '#kernel-services/state/actions';
    // #endregion external


    // #region internal
    import {
        StyledRecord,
        StyledRecordLogFormat,
        StyledRecordLevelTime,
        StyledRecordProjectSpaceMethod,
        StyledRecordErrorExtradata,
        StyledRecordContext,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface RecordOwnProperties {
    plurid: PluridComponentProperty;
}

export interface RecordStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateRecords: LoggedRecord[];
}

export interface RecordDispatchProperties {
}

export type RecordProperties = RecordOwnProperties
    & RecordStateProperties
    & RecordDispatchProperties;

const Record: React.FC<RecordProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region own
        plurid,
        // #endregion own

        // #region state
        stateRecords,
        // stateGeneralTheme,
        // stateInteractionTheme,
        // #endregion state
    } = properties;

    const {
        id,
    } = plurid.route.plane.parameters;
    // #endregion properties


    // #region state
    const [
        record,
        setRecord,
    ] = useState(
        stateRecords.find(record => record.id === id)
    );
    // #endregion state


    // #region effects
    useEffect(() => {
        const record = stateRecords.find(record => record.id === id);

        if (record) {
            setRecord(record);
        }
    }, [
        stateRecords,
    ]);
    // #endregion effects


    // #region render
    const recordRender = (
        record: LoggedRecord,
    ) => {
        const {
            log,
            format,

            level,
            time,

            project,
            space,
            method,

            error,
            extradata,

            context,
        } = record;

        const logLevelText = logLevelsText[level];
        const date = new Date(time * 1000).toLocaleString();

        return (
            <StyledRecord>
                <StyledRecordLogFormat>
                    <h1>
                        <PluridIconInfo
                            title="log"
                            style={{
                                marginRight: '0.5rem',
                            }}
                        />

                        {log}
                    </h1>

                    <h2>
                        <PluridIconInfo
                            title="format"
                            style={{
                                marginRight: '0.5rem',
                            }}
                        />

                        {format}
                    </h2>
                </StyledRecordLogFormat>


                <StyledRecordLevelTime>
                    <div>
                        <PluridIconInfo
                            title="level"
                            style={{
                                marginRight: '0.5rem',
                            }}
                        />

                        {logLevelText}
                    </div>

                    <div>
                        <PluridIconInfo
                            title="time"
                            style={{
                                marginRight: '0.5rem',
                            }}
                        />

                        {date}
                    </div>
                </StyledRecordLevelTime>


                {(project || space || method) && (

                    <StyledRecordProjectSpaceMethod>
                        {project && (
                            <div>
                                <PluridIconInfo
                                    title="project"
                                    style={{
                                        marginRight: '0.5rem',
                                    }}
                                />

                                {project}
                            </div>
                        )}

                        {space && (
                            <div>
                                <PluridIconInfo
                                    title="space"
                                    style={{
                                        marginRight: '0.5rem',
                                    }}
                                />

                                {space}
                            </div>
                        )}

                        {method && (
                            <div>
                                <PluridIconInfo
                                    title="method"
                                    style={{
                                        marginRight: '0.5rem',
                                    }}
                                />

                                {method}
                            </div>
                        )}
                    </StyledRecordProjectSpaceMethod>
                )}


                {(error || extradata) && (
                    <StyledRecordErrorExtradata>
                        {error && (
                            <div>
                                <PluridIconInfo
                                    title="error"
                                    style={{
                                        marginRight: '0.5rem',
                                    }}
                                />

                                {error}
                            </div>
                        )}

                        {extradata && (
                            <div>
                                <PluridIconInfo
                                    title="extradata"
                                    style={{
                                        marginRight: '0.5rem',
                                    }}
                                />

                                {extradata}
                            </div>
                        )}
                    </StyledRecordErrorExtradata>
                )}


                {context && (
                    <StyledRecordContext>
                        <div>
                            <PluridIconInfo
                                title="context"
                                style={{
                                    marginRight: '0.5rem',
                                }}
                            />

                            <div>
                                <PluridLink
                                    route="/code/1"
                                >
                                    show code
                                </PluridLink>
                            </div>
                        </div>

                        <pre>
                            {JSON.stringify(context, null, 4)}
                        </pre>
                    </StyledRecordContext>
                )}
           </StyledRecord>
        );
    }

    return (
        <>
            {record && recordRender(record)}
        </>
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): RecordStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateRecords: selectors.data.getRecords(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): RecordDispatchProperties => ({
});


const ConnectedRecord = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(Record);
// #endregion module



// #region exports
export default ConnectedRecord;
// #endregion exports
