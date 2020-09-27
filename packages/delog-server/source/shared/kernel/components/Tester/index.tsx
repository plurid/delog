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
        StyledPluridTextline,
        StyledPluridPureButton,
        StyledPluridLinkButton,
    } from '#kernel-services/styled';
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
    // #endregion handlers


    // #region render
    return (
        <StyledTester
            theme={theme}
        >
            <div>
                <h1>
                    add tester
                </h1>

                <div>
                    <StyledPluridTextline
                        text={testerName}
                        placeholder="name"
                        atChange={(event) => setTesterName(event.target.value)}
                        atKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                addTester();
                            }
                        }}
                        spellCheck={false}
                        autoCapitalize="false"
                        autoComplete="false"
                        autoCorrect="false"
                        theme={theme}
                        level={2}
                    />
                </div>

                <div>
                    <StyledPluridPureButton
                        text="Add Tester"
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
            </div>
        </StyledTester>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Tester;
// #endregion exports
