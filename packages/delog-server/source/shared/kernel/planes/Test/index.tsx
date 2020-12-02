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
        PluridIconValid,
        PluridIconInvalid,
    } from '@plurid/plurid-icons-react';

    import {
        PluridComponentProperty,
    } from '@plurid/plurid-react';
    // #endregion libraries


    // #region external
    import {
        Test,
    } from '~server/data/interfaces';

    import { AppState } from '~kernel-services/state/store';
    import selectors from '~kernel-services/state/selectors';
    // import actions from '~kernel-services/state/actions';

    import {
        PluridTextItem,
    } from '~kernel-services/styled';
    // #endregion external


    // #region internal
    import {
        StyledTest,
        StyledTestPhases,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface TestOwnProperties {
    plurid: PluridComponentProperty;
}

export interface TestStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateTests: Test[];
}

export interface TestDispatchProperties {
}

export type TestProperties = TestOwnProperties
    & TestStateProperties
    & TestDispatchProperties;

const Test: React.FC<TestProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region own
        plurid,
        // #endregion own

        // #region state
        stateTests,
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
        test,
        setTest,
    ] = useState(
        stateTests.find(test => test.id === id)
    );
    // #endregion state


    // #region effects
    useEffect(() => {
        const test = stateTests.find(test => test.id === id);

        if (test) {
            setTest(test);
        }
    }, [
        stateTests,
    ]);
    // #endregion effects


    // #region render
    const testRender = (
        test: Test,
    ) => {
        const {
            time,
            tester,
            status,
            phasesStatus,
        } = test;

        const date = new Date(time * 1000).toLocaleString();

        return (
            <StyledTest>
                <PluridTextItem
                    icon={status ? PluridIconValid : PluridIconInvalid}
                    name={status ? 'passed' : 'failed'}
                    render={(
                        <h1>
                            {tester}
                        </h1>
                    )}
                />

                <h2>
                    {date}
                </h2>

                <StyledTestPhases>
                    <ul>
                        {phasesStatus.map((phaseStatus, index) => {
                            return (
                                <li
                                    key={index}
                                >
                                    <PluridTextItem
                                        icon={phaseStatus ? PluridIconValid : PluridIconInvalid}
                                        name={phaseStatus ? 'passed' : 'failed'}
                                        render={(
                                            <div>
                                                phase {index}
                                            </div>
                                        )}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </StyledTestPhases>
           </StyledTest>
        );
    }

    return (
        <>
            {test && testRender(test)}
        </>
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): TestStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateTests: selectors.data.getTests(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): TestDispatchProperties => ({
});


const ConnectedTest = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(Test);
// #endregion module



// #region exports
export default ConnectedTest;
// #endregion exports
