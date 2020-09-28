// #region imports
    // #region libraries
    import React, {
        useState,
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
        GENERATE_TESTER,
    } from '#kernel-services/graphql/mutate';

    import {
        StyledH1,
        StyledPluridPureButton,
        StyledPluridLinkButton,
    } from '#kernel-services/styled';

    import InputLine from '../InputLine';
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
        testerName,
        setTesterName,
    ] = useState('');
    // #endregion state


    // #region handlers
    const addTester = async () => {
        if (!testerName) {
            return;
        }

        const tester: ITester | undefined = await addEntityMutation(
            {
                name: testerName,
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
    // #endregion handlers


    // #region render
    return (
        <StyledTester
            theme={theme}
        >
            <StyledH1>
                generate tester
            </StyledH1>

            <InputLine
                name="project"
                text={testerName}
                theme={theme}
                atChange={(event) => setTesterName(event.target.value)}
                atKeyDown={handleEnter}
            />

            <div>
                <StyledPluridPureButton
                    text="Generate Tester"
                    atClick={() => addTester()}
                    level={2}
                    disabled={!testerName}
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
        </StyledTester>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Tester;
// #endregion exports
