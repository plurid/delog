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
    } from '~server/utilities/general';

    import {
        Tester,
    } from '~server/data/interfaces';

    import EntityView from '~kernel-components/EntityView';

    import client from '~kernel-services/graphql/client';

    import {
        OBLITERATE_TESTER,
    } from '~kernel-services/graphql/mutate';

    import {
        getCurrentOwner,
    } from '~kernel-services/logic/queries';

    import { AppState } from '~kernel-services/state/store';
    import selectors from '~kernel-services/state/selectors';
    import actions from '~kernel-services/state/actions';

    import {
        getFilterIDs,
    } from '~kernel-services/utilities';
    // #endregion external


    // #region internal
    import {
        testerRowRenderer,
        createSearchTerms,
    } from './logic';
    // #endregion internal
// #endregion imports



// #region module
export interface TestersViewOwnProperties {
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

export interface TestersViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateTesters: Tester[];
}

export interface TestersViewDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    dispatchRemoveEntity: typeof actions.data.removeEntity;
}

export type TestersViewProperties = TestersViewOwnProperties
    & TestersViewStateProperties
    & TestersViewDispatchProperties;

const TestersView: React.FC<TestersViewProperties> = (
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
        stateTesters,
        // #endregion state

        // #region dispatch
        dispatch,
        dispatchRemoveEntity,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region handlers
    const handleTesterObliterate = async (
        id: string,
    ) => {
        try {
            dispatchRemoveEntity({
                type: 'tester',
                id,
            });

            const input = {
                value: id,
            };

            await client.mutate({
                mutation: OBLITERATE_TESTER,
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
        createSearchTerms(stateTesters),
    );

    const [filteredRows, setFilteredRows] = useState(
        stateTesters.map(
            tester => testerRowRenderer(
                tester,
                handleTesterObliterate,
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

        const filteredTesters = stateTesters.filter(stateTester => {
            if (filterIDs.includes(stateTester.id)) {
                return true;
            }

            return false;
        });

        const sortedTesters = filteredTesters.sort(
            compareValues('name'),
        );

        setFilteredRows(
            sortedTesters.map(
                tester => testerRowRenderer(
                    tester,
                    handleTesterObliterate,
                ),
            ),
        );
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const searchTerms = createSearchTerms(
            stateTesters,
        );
        const filteredRows = stateTesters.map(
            tester => testerRowRenderer(
                tester,
                handleTesterObliterate,
            ),
        );

        setSearchTerms(searchTerms);
        setFilteredRows(filteredRows);
    }, [
        stateTesters,
    ]);
    // #endregion effects


    // #region render
    const rowsHeader = (
        <>
            <div>
                id
            </div>

            <div>
                name
            </div>

            <div>
                project
            </div>

            <div>
                suite
            </div>

            <div>
                scenario
            </div>

            <div>
                configuration
            </div>

            <div />
        </>
    );

    return (
        <EntityView
            generalTheme={stateGeneralTheme}
            interactionTheme={stateInteractionTheme}

            rowTemplate="1fr 1fr 1fr 1fr 1fr 3fr 30px"
            rowsHeader={rowsHeader}
            rows={filteredRows}
            noRows="no testers"

            actionButtonText="Generate Tester"
            actionButtonClick={() => {
                setGeneralView('generate-tester');
            }}

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
): TestersViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateTesters: selectors.data.getTesters(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): TestersViewDispatchProperties => ({
    dispatch,
    dispatchRemoveEntity: (
        payload,
    ) => dispatch (
        actions.data.removeEntity(payload),
    ),
});


const ConnectedTestersView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(TestersView);
// #endregion module



// #region exports
export default ConnectedTestersView;
// #endregion exports
