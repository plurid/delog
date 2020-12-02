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
        ClientToken,
    } from '~server/data/interfaces';

    import {
        addEntityMutation,
    } from '~kernel-services/logic/mutations';

    import {
        GENERATE_TOKEN,
    } from '~kernel-services/graphql/mutate';

    import {
        StyledH1,
        StyledPluridPureButton,
        StyledPluridLinkButton,

        PluridInputLine,
        PluridCopyableLine,
    } from '~kernel-services/styled';
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

    const handleEnter = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            addToken();
        }
    }
    // #endregion handlers


    // #region render
    return (
        <StyledToken
            theme={theme}
        >
            {tokenValue === '' && (
                <>
                    <StyledH1>
                        generate token
                    </StyledH1>

                    <PluridInputLine
                        name="name"
                        text={tokenName}
                        theme={theme}
                        atChange={(event) => setTokenName(event.target.value)}
                        atKeyDown={handleEnter}
                    />

                    <StyledPluridPureButton
                        text="Generate Token"
                        atClick={() => addToken()}
                        level={2}
                        disabled={!tokenName}
                    />

                    {cancel && (
                        <StyledPluridLinkButton
                            text="cancel"
                            atClick={() => cancel()}
                            theme={theme}
                            level={2}
                        />
                    )}
                </>
            )}

            {tokenValue !== '' && (
                <>
                    <StyledH1>
                        token added
                    </StyledH1>

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
                            <PluridCopyableLine
                                data={tokenValue}
                            />
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
        </StyledToken>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Token;
// #endregion exports
