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
    import {
        Project,
    } from '~server/data/interfaces';

    import {
        AnalyticsRecordsCount,
        AnalyticsSize,
    } from '~kernel-data/interfaces';

    import RecordsPieChart from '~kernel-components/Analytics/RecordsPieChart';
    import RecordsSize from '~kernel-components/Analytics/RecordsSize';

    import {
        getProjects,
        getAnalyticsLastPeriod,
        getAnalyticsSize,
    } from '~kernel-services/logic/queries';

    import { AppState } from '~kernel-services/state/store';
    import selectors from '~kernel-services/state/selectors';
    import actions from '~kernel-services/state/actions';
    // #endregion external


    // #region internal
    import {
        StyledAnalyticsView,
        StyledAnalyticsViewBlocks,
    } from './styled';

    import {
        analyticsRecordsTypes,
    } from './data';
    // #endregion internal
// #endregion imports



// #region module
export interface AnalyticsViewOwnProperties {
}

export interface AnalyticsViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateProjects: Project[];
    stateAnalyticsEntries: AnalyticsRecordsCount;
    stateAnalyticsFaults: AnalyticsRecordsCount;
    stateAnalyticsSize: AnalyticsSize;
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
        // #region state
        stateGeneralTheme,
        stateInteractionTheme,
        stateProjects,
        stateAnalyticsEntries,
        stateAnalyticsFaults,
        stateAnalyticsSize,
        // #endregion state

        // #region dispatch
        dispatch,
        // #endregion dispatch
    } = properties;

    const projects = stateProjects.map(project => project.name);
    // #endregion properties


    // #region handlers
    const updateRecords = (
        project: string,
        period: string,
        type: string,
    ) => {
        getAnalyticsLastPeriod(
            dispatch,
            {
                project,
                period,
                type,
            },
        );
    }

    const updateSize = (
        project: string,
    ) => {
        getAnalyticsSize(
            dispatch,
            {
                project,
            },
        );
    }
    // #endregion handlers


    // #region render
    return (
        <StyledAnalyticsView>
            <StyledAnalyticsViewBlocks>
                {analyticsRecordsTypes.map((type) => {
                    let stateData;

                    switch (type) {
                        case 'entries':
                            stateData = stateAnalyticsEntries;
                            break;
                        case 'faults':
                            stateData = stateAnalyticsFaults;
                    }

                    if (!stateData) {
                        return;
                    }

                    return (
                        <RecordsPieChart
                            key={type}
                            generalTheme={stateGeneralTheme}
                            interactionTheme={stateInteractionTheme}
                            type={type}
                            data={stateData.data}
                            project={stateData.project}
                            period={stateData.period}
                            projects={projects}
                            updateData={(
                                project,
                                period,
                            ) => {
                                updateRecords(
                                    project,
                                    period,
                                    type,
                                );
                            }}
                            updateProjects={() => {
                                getProjects(dispatch);
                            }}
                        />
                    );
                })}

                <RecordsSize
                    generalTheme={stateGeneralTheme}
                    interactionTheme={stateInteractionTheme}
                    size={stateAnalyticsSize.value}
                    project={stateAnalyticsSize.project}
                    projects={projects}
                    updateData={(
                        project,
                    ) => {
                        updateSize(project);
                    }}
                    updateProjects={() => {
                        getProjects(dispatch);
                    }}
                />
            </StyledAnalyticsViewBlocks>
        </StyledAnalyticsView>
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): AnalyticsViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateProjects: selectors.data.getProjects(state),
    stateAnalyticsEntries: selectors.data.getAnalyticsEntries(state),
    stateAnalyticsFaults: selectors.data.getAnalyticsFaults(state),
    stateAnalyticsSize: selectors.data.getAnalyticsSize(state),
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
