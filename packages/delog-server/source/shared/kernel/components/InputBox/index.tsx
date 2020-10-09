// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region internal
    import {
        StyledInputBox,
        StyledInputBoxText,
        StyledTextBox,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface InputBoxProperties {
    name: string;
    text: string;
    theme: any;
    atChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    atKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties;
}

const InputBox: React.FC<InputBoxProperties> = (
    properties,
) => {
    // #region properties
    const {
        text,
        name,
        atChange,
        atKeyDown,
        theme,
        style,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <StyledInputBox>
            <StyledInputBoxText>
                {text !== '' && (
                    <>
                        {name}
                    </>
                )}
            </StyledInputBoxText>

            <StyledTextBox
                theme={theme}
            >
                <textarea
                    value={text}
                    placeholder={name}
                    onChange={(event) => atChange(event as any)}
                    onKeyDown={(event) => atKeyDown ? atKeyDown(event as any) : null}
                    spellCheck={false}
                    autoCapitalize="false"
                    autoComplete="false"
                    autoCorrect="false"
                    style={{
                        ...style,
                    }}
                />
            </StyledTextBox>
        </StyledInputBox>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default InputBox;
// #endregion exports
