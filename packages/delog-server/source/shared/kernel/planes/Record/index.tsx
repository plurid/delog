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

    import {
        PluridLinkButton,
    } from '@plurid/plurid-ui-react';
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
        StyledRecordContextGroup,
    } from './styled';

    import TextItem from './components/TextItem';
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
                    <TextItem
                        name="log"
                        render={(
                            <h1>
                                {log}
                            </h1>
                        )}
                    />

                    <TextItem
                        name="format"
                        render={(
                            <h2>
                                {format}
                            </h2>
                        )}
                    />
                </StyledRecordLogFormat>


                <StyledRecordLevelTime>
                    <TextItem
                        name="level"
                        render={(<>{logLevelText}</>)}
                    />

                    <TextItem
                        name="time"
                        render={(<>{date}</>)}
                    />
                </StyledRecordLevelTime>


                {(project || space || method) && (
                    <StyledRecordProjectSpaceMethod>
                        {project && (
                            <TextItem
                                name="project"
                                render={(<>{project}</>)}
                            />
                        )}

                        {space && (
                            <TextItem
                                name="space"
                                render={(<>{space}</>)}
                            />
                        )}

                        {method && (
                            <TextItem
                                name="method"
                                render={(<>{method}</>)}
                            />
                        )}
                    </StyledRecordProjectSpaceMethod>
                )}


                {(error || extradata) && (
                    <StyledRecordErrorExtradata>
                        {error && (
                            <TextItem
                                name="error"
                                render={(<>{error}</>)}
                            />
                        )}

                        {extradata && (
                            <TextItem
                                name="extradata"
                                render={(<>{extradata}</>)}
                            />
                        )}
                    </StyledRecordErrorExtradata>
                )}


                {context && (
                    <StyledRecordContext>
                        <StyledRecordContextGroup>
                            <TextItem
                                name="context"
                                render={(
                                    <>
                                        <div
                                            style={{
                                                marginRight: '2rem',
                                            }}
                                        >
                                            <PluridLink
                                                route={`/code/${id}`}
                                            >
                                                source
                                            </PluridLink>
                                        </div>

                                        <PluridLinkButton
                                            text={expandContext ? 'contract' : 'expand'}
                                            atClick={() => setExpandContext(show => !show)}
                                            inline={true}
                                            style={{
                                                fontFamily: 'Ubuntu',
                                                padding: '0 0',
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
