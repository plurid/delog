// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region external
    import {
        StyledPluridTextline,
    } from '#kernel-services/styled';
    // #endregion external


    // #region internal
    import {
        StyledInputLine,
        StyledInputLineText,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface InputLineProperties {
    name: string;
    text: string;
    theme: any;
    atChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    atKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;

    type?: 'text' | 'password' | undefined;
}

const InputLine: React.FC<InputLineProperties> = (
    properties,
) => {
    // #region properties
    const {
        text,
        name,
        atChange,
        atKeyDown,
        theme,
        type,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <StyledInputLine>
            <StyledInputLineText>
                {text !== '' && (
                    <>
                        {name}
                    </>
                )}
            </StyledInputLineText>

            <StyledPluridTextline
                text={text}
                type={type}
                placeholder={name}
                atChange={atChange}
                atKeyDown={atKeyDown}
                spellCheck={false}
                autoCapitalize="false"
                autoComplete="false"
                autoCorrect="false"
                theme={theme}
                level={2}
            />
        </StyledInputLine>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default InputLine;
// #endregion exports
