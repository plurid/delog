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
    // #endregion libraries


    // #region external
    import {
        compareValues,
    } from '~server/utilities/general';

    import {
        parseFilter,
    } from '~server/utilities/filter';

    import {
        logLevelsText,
    } from '~server/data/constants/logger';

    import {
        LoggedRecord,
        InputQuery,
    } from '~server/data/interfaces';

    import {
        AnalyticsRecordsCount,
        AnalyticsSize,
    } from '~kernel-data/interfaces';

    import EntityView, {
        EntityViewRefAttributes,
    } from '~kernel-components/EntityView';

    import client from '~kernel-services/graphql/client';

    import {
        OBLITERATE_RECORD,
        OBLITERATE_RECORDS,
    } from '~kernel-services/graphql/mutate';

    import {
        getRecords,
        getAnalyticsLastPeriod,
        getAnalyticsSize,
    } from '~kernel-services/logic/queries';

    import { AppState } from '~kernel-services/state/store';
    import selectors from '~kernel-services/state/selectors';
    import actions from '~kernel-services/state/actions';

    import {
        getFilterIDs,
    } from '~kernel-services/utilities';

    import {
        PluridLinkButton,
    } from '~kernel-services/styled';
    // #endregion external


    // #region internal
    import {
        recordRowRenderer,
        createSearchTerms,
    } from './logic';

    import {
        StyledObliterateButton,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface RecordsViewOwnProperties {
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

export interface RecordsViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateRecords: LoggedRecord[];
    stateAnalyticsEntries: AnalyticsRecordsCount;
    stateAnalyticsFaults: AnalyticsRecordsCount;
    stateAnalyticsSize: AnalyticsSize;
}

export interface RecordsViewDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    dispatchRemoveEntity: typeof actions.data.removeEntity;
    dispatchRemoveEntities: typeof actions.data.removeEntities;
}

export type RecordsViewProperties = RecordsViewOwnProperties
    & RecordsViewStateProperties
    & RecordsViewDispatchProperties;

const RecordsView: React.FC<RecordsViewProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region state
        stateGeneralTheme,
        stateInteractionTheme,
        stateRecords,
        stateAnalyticsEntries,
        stateAnalyticsFaults,
        stateAnalyticsSize,
        // #endregion state

        // #region dispatch
        dispatch,
        dispatchRemoveEntity,
        dispatchRemoveEntities,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region references
    const entityView = useRef<EntityViewRefAttributes | null>(null);
    // #endregion references


    // #region handlers
    const handleRecordObliterate = async (
        id: string,
    ) => {
        try {
            dispatchRemoveEntity({
                type: 'record',
                id,
            });

            const input = {
                value: id,
            };

            await client.mutate({
                mutation: OBLITERATE_RECORD,
                variables: {
                    input,
                },
            });

            getAnalytics();
        } catch (error) {
            return;
        }
    }
    // #endregion handlers


    // #region state
    const [
        searchTerms,
        setSearchTerms,
    ] = useState(
        createSearchTerms(stateRecords),
    );

    const [
        filteredRows,
        setFilteredRows,
    ] = useState(
        stateRecords.map(
            record => recordRowRenderer(
                record,
                handleRecordObliterate,
            ),
        ),
    );

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        filterValue,
        setFilterValue,
    ] = useState('');

    const [
        filterIDs,
        setFilterIDs,
    ] = useState<string[]>([]);
    // #endregion state


    // #region handlers
    const filterUpdate = (
        rawValue: string,
    ) => {
        setFilterValue(rawValue);

        if (!rawValue) {
            setFilteredRows(
                stateRecords.map(
                    record => recordRowRenderer(
                        record,
                        handleRecordObliterate,
                    ),
                ),
            );

            return;
        }

        const parsedFilter = parseFilter(rawValue);

        if (!parsedFilter) {
            return;
        }

        if (typeof parsedFilter === 'string') {
            const value = rawValue.toLowerCase();

            const filterIDs = getFilterIDs(
                searchTerms,
                value,
            );

            setFilterIDs(filterIDs);

            const filteredRecords = stateRecords.filter(stateRecord => {
                if (filterIDs.includes(stateRecord.id)) {
                    return true;
                }

                return false;
            });

            const sortedRecords = filteredRecords.sort(
                compareValues('time', 'desc'),
            );

            setFilteredRows(
                sortedRecords.map(
                    record => recordRowRenderer(
                        record,
                        handleRecordObliterate,
                    ),
                ),
            );

            return;
        }

        const {
            projects,
            spaces,
            levels,
            logs,
        } = parsedFilter;

        const filteredRecords = stateRecords.filter(stateRecord => {
            let projectMatch = projects.length > 0 ? false : true;
            let spaceMatch = spaces.length > 0 ? false : true;
            let logMatch = logs.length > 0 ? false : true;
            let levelMatch = levels.length > 0 ? false : true;

            if (stateRecord.project && projects.includes(stateRecord.project)) {
                projectMatch = true;
            }

            if (stateRecord.space && spaces.includes(stateRecord.space)) {
                spaceMatch = true;
            }

            for (const log of logs) {
                if (stateRecord.log.toLowerCase().includes(log)) {
                    logMatch = true;
                    break;
                }
            }

            for (const level of levels) {
                const levelText = logLevelsText[stateRecord.level];

                if (level === levelText) {
                    levelMatch = true;
                    break;
                }
            }

            if (
                projectMatch
                && spaceMatch
                && logMatch
                && levelMatch
            ) {
                return true;
            }

            return false;
        });

        const sortedRecords = filteredRecords.sort(
            compareValues('time', 'desc'),
        );

        setFilteredRows(
            sortedRecords.map(
                record => recordRowRenderer(
                    record,
                    handleRecordObliterate,
                ),
            ),
        );
    }

    const actionScrollBottom = async (
        records: any[],
    ) => {
        setLoading(true);

        const last = records[records.length - 1];

        const pagination: InputQuery = {
            count: 10,
            start: last?.id,
        };

        await getRecords(dispatch, pagination);

        if (filterValue) {
            filterUpdate(filterValue);
        }

        setLoading(false);
    }

    const obliterateRecords = async () => {
        try {
            if (filterValue) {
                const ids = [
                    ...filterIDs,
                ];

                if (entityView.current) {
                    entityView.current.resetFilterValue();
                }

                dispatchRemoveEntities({
                    type: 'records',
                    ids,
                });

                const input = {
                    ids,
                };

                await client.mutate({
                    mutation: OBLITERATE_RECORDS,
                    variables: {
                        input,
                    },
                });

                getAnalytics();

                return;
            }

            dispatchRemoveEntities({
                type: 'records',
                ids: stateRecords.map(record => record.id),
            });

            await client.mutate({
                mutation: OBLITERATE_RECORDS,
            });

            getAnalytics();
        } catch (error) {
            return;
        }
    }

    const getAnalytics = () => {
        getAnalyticsLastPeriod(dispatch, {
            project: stateAnalyticsEntries.project,
            period: stateAnalyticsEntries.period,
            type: 'entries',
        });
        getAnalyticsLastPeriod(dispatch, {
            project: stateAnalyticsFaults.project,
            period: stateAnalyticsFaults.period,
            type: 'faults',
        });
        getAnalyticsSize(dispatch, {
            project: stateAnalyticsSize.project,
        });
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const searchTerms = createSearchTerms(
            stateRecords,
        );
        const filteredRows = stateRecords.map(
            record => recordRowRenderer(
                record,
                handleRecordObliterate,
            ),
        );

        setSearchTerms(searchTerms);
        setFilteredRows(filteredRows);
    }, [
        stateRecords,
    ]);

    useEffect(() => {
        getRecords(dispatch);
    }, []);
    // #endregion effects


    // #region render
    const rowsHeader = (
        <>
            <div>
                project
            </div>

            <div>
                space
            </div>

            <div>
                level
            </div>

            <div>
                log
            </div>

            <div>
                details
            </div>

            <div />
        </>
    );

    return (
        <>
            <EntityView
                ref={entityView}

                generalTheme={stateGeneralTheme}
                interactionTheme={stateInteractionTheme}

                rowTemplate="0.5fr 0.5fr 60px 3fr 100px 30px"
                rowsHeader={rowsHeader}
                rows={filteredRows}
                noRows="no records"

                entities={stateRecords}
                loading={loading ? 1 : 0}

                filterUpdate={filterUpdate}
                refresh={() => {
                    getRecords(dispatch);

                    getAnalytics();
                }}

                actionScrollBottom={actionScrollBottom}
            />

            {stateRecords.length > 0
            && (filterValue ? filteredRows.length > 0 : true)
            && (
                <StyledObliterateButton>
                    <PluridLinkButton
                        text={filterValue
                            ? `obliterate with filter '${filterValue}'`
                            : 'obliterate'
                        }
                        atClick={() => obliterateRecords()}
                        inline={true}
                    />
                </StyledObliterateButton>
            )}
        </>
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): RecordsViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateRecords: selectors.data.getRecords(state),
    stateAnalyticsEntries: selectors.data.getAnalyticsEntries(state),
    stateAnalyticsFaults: selectors.data.getAnalyticsFaults(state),
    stateAnalyticsSize: selectors.data.getAnalyticsSize(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): RecordsViewDispatchProperties => ({
    dispatch,
    dispatchRemoveEntity: (
        payload,
    ) => dispatch (
        actions.data.removeEntity(payload),
    ),
    dispatchRemoveEntities: (
        payload,
    ) => dispatch (
        actions.data.removeEntities(payload),
    ),
});


const ConnectedRecordsView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(RecordsView);
// #endregion module



// #region exports
export default ConnectedRecordsView;
// #endregion exports
