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

    import {
        PluridHeading,
        PluridParagraph,
    } from '@plurid/plurid-ui-react'
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
                <PluridHeading
                    type="h1"
                >
                    {log}
                </PluridHeading>


                <PluridHeading
                    type="h2"
                >
                    {format}
                </PluridHeading>


                <div>
                    <div>
                        {logLevelText}
                    </div>

                    <div>
                        {date}
                    </div>
                </div>


                <div>
                    <div>
                        {project}
                    </div>

                    <div>
                        {space}
                    </div>

                    <div>
                        {method}
                    </div>
                </div>


                <div>
                    <div>
                        {JSON.stringify(error)}
                    </div>

                    <div>
                        {JSON.stringify(extradata)}
                    </div>
                </div>


                <div>
                    {JSON.stringify(context)}
                </div>
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
