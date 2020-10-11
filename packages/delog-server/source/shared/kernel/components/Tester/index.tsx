// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region external
    import {
        Tester as ITester,
    } from '#server/data/interfaces';

    import {
        addEntityMutation,
    } from '#kernel-services/logic/mutations';

    import {
        verifyUniqueID,
    } from '#kernel-services/logic/queries';

    import {
        GENERATE_TESTER,
    } from '#kernel-services/graphql/mutate';

    import {
        StyledH1,
        StyledPluridPureButton,
        StyledPluridLinkButton,
    } from '#kernel-services/styled';

    import InputLine from '../InputLine';
    import InputBox from '../InputBox';
    // #endregion external


    // #region internal
    import {
        StyledTester,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface TesterProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        action: (
            tester: ITester,
        ) => void;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        // #endregion values

        // #region methods
        cancel?: () => void;
        // #endregion methods
    // #endregion optional
}

const Tester: React.FC<TesterProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
            // #endregion values

            // #region methods
            action,
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            // #endregion values

            // #region methods
            cancel,
            // #endregion methods
        // #endregion optional
    } = properties;
    // #endregion properties


    // #region state
    const [
        testerUniqueID,
        setTesterUniqueID,
    ] = useState(false);
    const [
        testerID,
        setTesterID,
    ] = useState('');
    const [
        testerName,
        setTesterName,
    ] = useState('');
    const [
        testerProject,
        setTesterProject,
    ] = useState('');
    const [
        testerSuite,
        setTesterSuite,
    ] = useState('');
    const [
        testerScenario,
        setTesterScenario,
    ] = useState('');
    const [
        testerConfiguration,
        setTesterConfiguration,
    ] = useState('');

    const [
        validTester,
        setValidTester,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const addTester = async () => {
        if (!validTester) {
            return;
        }

        const tester: ITester | undefined = await addEntityMutation(
            {
                id: testerID,
                name: testerName,
                project: testerProject,
                suite: testerSuite,
                scenario: testerScenario,
                configuration: testerConfiguration,
            },
            GENERATE_TESTER,
            'generateTester',
        );

        if (tester) {
            action(tester);
        }
    }

    const handleEnter = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            addTester();
        }
    }

    const handleVerifyUniqueID = async () => {
        const isUnique = await verifyUniqueID({
            type: 'testers',
            value: testerID,
        });

        if (isUnique) {
            setTesterUniqueID(true);
        } else {
            setTesterUniqueID(false);
        }
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        let dataEntered = false;

        if (
            testerName
            && testerProject
            && testerSuite
            && testerScenario
            && testerConfiguration
        ) {
            dataEntered = true;
        } else {
            dataEntered = false;
        }

        if (!testerID) {
            if (dataEntered) {
                setValidTester(true);
            } else {
               setValidTester(false);
            }
        } else {
            if (
                testerUniqueID
                && dataEntered
            ) {
                setValidTester(true);
            } else {
               setValidTester(false);
            }
        }
    }, [
        testerUniqueID,
        testerID,
        testerName,
        testerProject,
        testerSuite,
        testerScenario,
        testerConfiguration,
    ]);
    // #endregion effects


    // #region render
    return (
        <StyledTester
            theme={theme}
        >
            <StyledH1>
                generate tester
            </StyledH1>

            <InputLine
                name="id"
                text={testerID}
                theme={theme}
                atChange={(event) => {
                    setTesterID(event.target.value);

                    handleVerifyUniqueID();
                }}
                atKeyDown={handleEnter}
            />

            <InputLine
                name="name"
                text={testerName}
                theme={theme}
                atChange={(event) => setTesterName(event.target.value)}
                atKeyDown={handleEnter}
            />

            <InputLine
                name="project"
                text={testerProject}
                theme={theme}
                atChange={(event) => setTesterProject(event.target.value)}
                atKeyDown={handleEnter}
            />

            <InputLine
                name="suite"
                text={testerSuite}
                theme={theme}
                atChange={(event) => setTesterSuite(event.target.value)}
                atKeyDown={handleEnter}
            />

            <InputLine
                name="scenario"
                text={testerScenario}
                theme={theme}
                atChange={(event) => setTesterScenario(event.target.value)}
                atKeyDown={handleEnter}
            />

            <InputBox
                name="configuration"
                text={testerConfiguration}
                theme={theme}
                atChange={(event) => setTesterConfiguration(event.target.value)}
                style={{
                    fontFamily: `'Source Code Pro', monospace`,
                }}
            />

            <div>
                <StyledPluridPureButton
                    text="Generate Tester"
                    atClick={() => addTester()}
                    level={2}
                    disabled={!validTester}
                />
            </div>

            {cancel && (
                <div>
                    <StyledPluridLinkButton
                        text="cancel"
                        atClick={() => cancel()}
                        theme={theme}
                        level={2}
                    />
                </div>
            )}

            {testerID && !testerUniqueID && (
                <div>
                    the id must be unique
                </div>
            )}
        </StyledTester>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Tester;
// #endregion exports
