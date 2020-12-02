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
        Test,
        InputQuery,
    } from '~server/data/interfaces';

    import EntityView, {
        EntityViewRefAttributes,
    } from '~kernel-components/EntityView';

    import client from '~kernel-services/graphql/client';

    import {
        OBLITERATE_TEST,
        OBLITERATE_TESTS,
    } from '~kernel-services/graphql/mutate';

    import {
        getTests,
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
        testRowRenderer,
        createSearchTerms,
    } from './logic';

    import {
        StyledObliterateButton,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface TestsViewOwnProperties {
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

export interface TestsViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateTests: Test[];
}

export interface TestsViewDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    dispatchRemoveEntity: typeof actions.data.removeEntity;
    dispatchRemoveEntities: typeof actions.data.removeEntities;
}

export type TestsViewProperties = TestsViewOwnProperties
    & TestsViewStateProperties
    & TestsViewDispatchProperties;

const TestsView: React.FC<TestsViewProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region state
        stateGeneralTheme,
        stateInteractionTheme,
        stateTests,
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
    const handleTestObliterate = async (
        id: string,
    ) => {
        try {
            dispatchRemoveEntity({
                type: 'test',
                id,
            });

            const input = {
                value: id,
            };

            await client.mutate({
                mutation: OBLITERATE_TEST,
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
    const [searchTerms, setSearchTerms] = useState(
        createSearchTerms(stateTests),
    );

    const [filteredRows, setFilteredRows] = useState(
        stateTests.map(
            test => testRowRenderer(
                test,
                handleTestObliterate,
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
                stateTests.map(
                    test => testRowRenderer(
                        test,
                        handleTestObliterate,
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

            const filteredTests = stateTests.filter(stateTest => {
                if (filterIDs.includes(stateTest.id)) {
                    return true;
                }

                return false;
            });

            const sortedTests = filteredTests.sort(
                compareValues('time', 'desc'),
            );

            setFilteredRows(
                sortedTests.map(
                    test => testRowRenderer(
                        test,
                        handleTestObliterate,
                    ),
                ),
            );

            return;
        }
    }

    const actionScrollBottom = async (
        tests: any[],
    ) => {
        setLoading(true);

        const last = tests[tests.length - 1];

        const pagination: InputQuery = {
            count: 10,
            start: last?.id,
        };

        await getTests(
            dispatch,
            pagination,
        );

        if (filterValue) {
            filterUpdate(filterValue);
        }

        setLoading(false);
    }

    const obliterateTests = async () => {
        try {
            if (filterValue) {
                const ids = [
                    ...filterIDs,
                ];

                if (entityView.current) {
                    entityView.current.resetFilterValue();
                }

                dispatchRemoveEntities({
                    type: 'tests',
                    ids,
                });

                const input = {
                    ids,
                };

                await client.mutate({
                    mutation: OBLITERATE_TESTS,
                    variables: {
                        input,
                    },
                });

                return;
            }

            dispatchRemoveEntities({
                type: 'tests',
                ids: stateTests.map(test => test.id),
            });

            await client.mutate({
                mutation: OBLITERATE_TESTS,
            });
        } catch (error) {
            return;
        }
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const searchTerms = createSearchTerms(
            stateTests,
        );
        const filteredRows = stateTests.map(
            test => testRowRenderer(
                test,
                handleTestObliterate,
            ),
        );

        setSearchTerms(searchTerms);
        setFilteredRows(filteredRows);
    }, [
        stateTests,
    ]);

    useEffect(() => {
        getTests(dispatch);
    }, []);
    // #endregion effects


    // #region render
    const rowsHeader = (
        <>
            <div>
                status
            </div>

            <div>
                time
            </div>

            <div>
                tester
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

                rowTemplate="70px 200px 1fr 100px 30px"
                rowsHeader={rowsHeader}
                rows={filteredRows}
                noRows="no tests"

                entities={stateTests}
                loading={loading ? 1 : 0}

                filterUpdate={filterUpdate}
                refresh={() => {
                    getTests(dispatch);
                }}

                actionScrollBottom={actionScrollBottom}
            />

            {stateTests.length > 0
            && (filterValue ? filteredRows.length > 0 : true)
            && (
                <StyledObliterateButton>
                    <PluridLinkButton
                        text={filterValue
                            ? `obliterate with filter '${filterValue}'`
                            : 'obliterate'
                        }
                        atClick={() => obliterateTests()}
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
): TestsViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateTests: selectors.data.getTests(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): TestsViewDispatchProperties => ({
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


const ConnectedTestsView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(TestsView);
// #endregion module



// #region exports
export default ConnectedTestsView;
// #endregion exports
