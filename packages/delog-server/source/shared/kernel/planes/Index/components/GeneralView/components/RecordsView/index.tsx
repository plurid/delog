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
        PluridLinkButton,
    } from '@plurid/plurid-ui-react';
    // #endregion libraries


    // #region external
    import {
        compareValues,
    } from '#server/utilities/general';

    import {
        parseFilter,
    } from '#server/utilities/filter';

    import {
        LoggedRecord,
        InputQuery,
    } from '#server/data/interfaces';

    import EntityView, {
        EntityViewRefAttributes,
    } from '#kernel-components/EntityView';

    import client from '#kernel-services/graphql/client';

    import {
        OBLITERATE_RECORD,
        OBLITERATE_RECORDS,
    } from '#kernel-services/graphql/mutate';

    import {
        getRecords,
    } from '#kernel-services/logic/queries';

    import { AppState } from '#kernel-services/state/store';
    import selectors from '#kernel-services/state/selectors';
    import actions from '#kernel-services/state/actions';

    import {
        getFilterIDs,
    } from '#kernel-services/utilities';
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
            if (projects.includes(stateRecord.project)) {
                return true;
            }

            if (spaces.includes(stateRecord.space)) {
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

                return;
            }

            dispatchRemoveEntities({
                type: 'records',
                ids: stateRecords.map(record => record.id),
            });

            await client.mutate({
                mutation: OBLITERATE_RECORDS,
            });
        } catch (error) {
            return;
        }
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

            <div />
        </>
    );

    return (
        <>
            <EntityView
                ref={entityView}

                generalTheme={stateGeneralTheme}
                interactionTheme={stateInteractionTheme}

                rowTemplate="0.5fr 0.5fr 60px 3fr 30px"
                rowsHeader={rowsHeader}
                rows={filteredRows}
                noRows="no records"

                entities={stateRecords}
                loading={loading ? 1 : 0}

                filterUpdate={filterUpdate}
                refresh={() => {
                    getRecords(dispatch);
                }}

                actionScrollBottom={actionScrollBottom}
            />

            {stateRecords.length > 0 && (
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
