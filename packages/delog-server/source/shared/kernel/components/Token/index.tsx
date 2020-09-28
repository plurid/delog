// #region imports
    // #region libraries
    import React, {
        useEffect,
        useState,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        clipboard,
    } from '@plurid/plurid-functions';

    import {
        PluridIconCopy,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Token as IToken,
        ClientToken,
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
        StyledTokenValue,
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
            token: ClientToken,
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
    const [
        tokenValue,
        setTokenValue,
    ] = useState('');
    const [
        clientToken,
        setClientToken,
    ] = useState<ClientToken | null>();
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
            setTokenValue(token.value);

            const {
                id,
                name,
                startsWith,
            } = token;

            const clientToken: ClientToken = {
                id,
                name,
                startsWith,
            };
            setClientToken(clientToken);
        }
    }
    // #endregion handlers


    // #region render
    return (
        <StyledToken
            theme={theme}
        >
            <div>
                {tokenValue === '' && (
                    <>
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
                    </>
                )}

                {tokenValue !== '' && (
                    <>
                        <h1>
                            token added
                        </h1>

                        <div
                            style={{
                                margin: '4rem 0',
                            }}
                        >
                            <div
                                style={{
                                    marginBottom: '1rem',
                                }}
                            >
                                save the token value
                            </div>

                            <StyledTokenValue>
                                <PluridIconCopy
                                    atClick={() => clipboard.copy(tokenValue)}
                                    style={{
                                        marginRight: '1rem',
                                    }}
                                />

                                {tokenValue}
                            </StyledTokenValue>
                        </div>

                        <StyledPluridPureButton
                            text="Value Saved"
                            atClick={() => {
                                if (clientToken) {
                                    action(clientToken);
                                }

                                if (cancel) {
                                    cancel();
                                }
                            }}
                            level={2}
                        />
                    </>
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
