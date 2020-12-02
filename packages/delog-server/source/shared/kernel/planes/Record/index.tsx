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
        PluridIconEdit,
        PluridIconOrder,
        PluridIconTimeout,
        PluridIconApps,
        PluridIconFrame,
        PluridIconNewStateline,
        PluridIconPersonalSpace,
        PluridIconDocuments,
        PluridIconLoop,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        logLevelsText,
    } from '~server/data/constants/logger';

    import {
        LoggedRecord,
    } from '~server/data/interfaces';

    import { AppState } from '~kernel-services/state/store';
    import selectors from '~kernel-services/state/selectors';
    // import actions from '~kernel-services/state/actions';

    import {
        PluridLinkButton,
        PluridTextItem,
    } from '~kernel-services/styled';
    // #endregion external


    // #region internal
    import {
        StyledRecord,
        StyledRecordLogFormat,
        StyledRecordLevelTime,
        StyledRecordProjectSpaceMethod,
        StyledRecordErrorExtradata,
        StyledRecordContext,
        StyledRecordContextGroup,
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

    const [
        expandContext,
        setExpandContext,
    ] = useState(false);
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
                    <PluridTextItem
                        name="log"
                        render={(
                            <h1>
                                {log}
                            </h1>
                        )}
                    />

                    <PluridTextItem
                        icon={PluridIconEdit}
                        name="format"
                        render={(
                            <h2>
                                {format}
                            </h2>
                        )}
                    />
                </StyledRecordLogFormat>


                <StyledRecordLevelTime>
                    <PluridTextItem
                        icon={PluridIconOrder}
                        name="level"
                        render={(<>{logLevelText}</>)}
                    />

                    <PluridTextItem
                        icon={PluridIconTimeout}
                        name="time"
                        render={(<>{date}</>)}
                    />
                </StyledRecordLevelTime>


                {(project || space || method) && (
                    <StyledRecordProjectSpaceMethod>
                        {project && (
                            <PluridTextItem
                                icon={PluridIconApps}
                                name="project"
                                render={(<>{project}</>)}
                            />
                        )}

                        {space && (
                            <PluridTextItem
                                icon={PluridIconFrame}
                                name="space"
                                render={(<>{space}</>)}
                            />
                        )}

                        {method && (
                            <PluridTextItem
                                icon={PluridIconNewStateline}
                                name="method"
                                render={(<>{method}</>)}
                            />
                        )}
                    </StyledRecordProjectSpaceMethod>
                )}


                {(error || extradata) && (
                    <StyledRecordErrorExtradata>
                        {error && (
                            <PluridTextItem
                                icon={PluridIconPersonalSpace}
                                name="error"
                                render={(<>{error}</>)}
                            />
                        )}

                        {extradata && (
                            <PluridTextItem
                                icon={PluridIconDocuments}
                                name="extradata"
                                render={(<>{extradata}</>)}
                            />
                        )}
                    </StyledRecordErrorExtradata>
                )}


                {context && (
                    <StyledRecordContext>
                        <StyledRecordContextGroup>
                            <PluridTextItem
                                icon={PluridIconLoop}
                                name="context"
                                render={(
                                    <>
                                        <PluridLink
                                            route={`/code/${id}`}
                                            style={{
                                                marginRight: '1rem',
                                            }}
                                        >
                                            source
                                        </PluridLink>

                                        <PluridLinkButton
                                            text={expandContext ? 'contract' : 'expand'}
                                            atClick={() => setExpandContext(show => !show)}
                                            inline={true}
                                            style={{
                                                fontFamily: 'Ubuntu',
                                                padding: '0 0',
                                                border: 'none',
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </StyledRecordContextGroup>

                        {expandContext && (
                            <pre>
                                {JSON.stringify(context, null, 4)}
                            </pre>
                        )}
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
