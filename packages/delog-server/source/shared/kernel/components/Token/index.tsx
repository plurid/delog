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
        Token as IToken,
    } from '#server/data/interfaces';

    import {
        addEntityMutation,
    } from '#kernel-services/logic/mutations';

    import {
        GENERATE_TOKEN,
    } from '#kernel-services/graphql/mutate';

    import {
        StyledPluridTextline,
        StyledPluridPureButton,
        StyledPluridLinkButton,
    } from '#kernel-services/styled';
    // #endregion external


    // #region internal
    import {
        StyledToken,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface TokenProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        action: (
            token: IToken,
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

const Token: React.FC<TokenProperties> = (
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
        tokenName,
        setTokenName,
    ] = useState('');
    // #endregion state


    // #region handlers
    const addToken = async () => {
        if (!tokenName) {
            return;
        }

        const token: IToken | undefined = await addEntityMutation(
            {
                name: tokenName,
            },
            GENERATE_TOKEN,
            'generateToken',
        );

        if (token) {
            action(token);
        }
    }
    // #endregion handlers


    // #region render
    return (
        <StyledToken
            theme={theme}
        >
            <div>
                <h1>
                    add token
                </h1>

                <div>
                    <StyledPluridTextline
                        text={tokenName}
                        placeholder="name"
                        atChange={(event) => setTokenName(event.target.value)}
                        atKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                addToken();
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
                        text="Add Token"
                        atClick={() => addToken()}
                        level={2}
                        disabled={!tokenName}
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
        </StyledToken>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Token;
// #endregion exports
