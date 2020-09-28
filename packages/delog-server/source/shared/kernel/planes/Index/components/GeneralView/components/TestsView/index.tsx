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
    // #endregion libraries


    // #region external
    import {
        compareValues,
    } from '#server/utilities/general';

    import {
        Test,
    } from '#server/data/interfaces';

    import EntityView from '#kernel-components/EntityView';

    import client from '#kernel-services/graphql/client';

    import {
        OBLITERATE_PROJECT,
    } from '#kernel-services/graphql/mutate';

    import {
        getCurrentOwner,
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
        testRowRenderer,
        createSearchTerms,
    } from './logic';
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
}

export type TestsViewProperties = TestsViewOwnProperties
    & TestsViewStateProperties
    & TestsViewDispatchProperties;

const TestsView: React.FC<TestsViewProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            // #endregion values

            // #region methods
            setGeneralView,
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            // #endregion values

            // #region methods
            // #endregion methods
        // #endregion optional

        // #region state
        stateGeneralTheme,
        stateInteractionTheme,
        stateTests,
        // #endregion state

        // #region dispatch
        dispatch,
        dispatchRemoveEntity,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region handlers
    const handleTestObliterate = async (
        id: string,
    ) => {
        try {
            // dispatchRemoveEntity({
            //     type: 'test',
            //     id,
            // });

            const input = {
                value: id,
            };

            await client.mutate({
                mutation: OBLITERATE_PROJECT,
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
    // #endregion state


    // #region handlers
    const filterUpdate = (
        rawValue: string,
    ) => {
        const value = rawValue.toLowerCase();

        const filterIDs = getFilterIDs(
            searchTerms,
            value,
        );

        const filteredTests = stateTests.filter(stateTest => {
            if (filterIDs.includes(stateTest.id)) {
                return true;
            }

            return false;
        });

        const sortedTests = filteredTests.sort(
            compareValues('name'),
        );

        setFilteredRows(
            sortedTests.map(
                test => testRowRenderer(
                    test,
                    handleTestObliterate,
                ),
            ),
        );
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
    // #endregion effects


    // #region render
    const rowsHeader = (
        <>
            <div>
                name
            </div>

            <div />
        </>
    );

    return (
        <EntityView
            generalTheme={stateGeneralTheme}
            interactionTheme={stateInteractionTheme}

            rowTemplate="auto 30px"
            rowsHeader={rowsHeader}
            rows={filteredRows}
            noRows="no tests"

            filterUpdate={filterUpdate}
            refresh={() => {
                getCurrentOwner(dispatch);
            }}
        />
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
});


const ConnectedTestsView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(TestsView);
// #endregion module



// #region exports
export default ConnectedTestsView;
// #endregion exports
