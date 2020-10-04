// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export const StyledInputBox = styled.div`
`;


export const StyledInputBoxText = styled.div`
    text-align: left;
    font-size: 0.9rem;
    min-height: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 0.6rem;
    margin-left: 0.9rem;
`;


export interface IStyledTextBox {
    theme: Theme;
}

export const StyledTextBox = styled.div<IStyledTextBox>`
    textarea {
        width: 100%;
        min-height: 5rem;
        resize: vertical;
        outline: none;
        border: none;
        padding: 0.9rem;
        font-size: 0.8rem;
        border-radius: 0.9rem;
        line-height: 1.5;
        font-family: Ubuntu, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Open Sans', 'Helvetica Neue', sans-serif;

        color: ${
            ({
                theme,
            }: IStyledTextBox) => theme.colorPrimary
        };
        background-color: ${
            ({
                theme,
            }: IStyledTextBox) => theme.backgroundColorTertiary
        };
        box-shadow: inset 0px 4px 4px ${
            ({
                theme,
            }: IStyledTextBox) => theme.boxShadowUmbraColor
        };
    }
`;
// #endregion module
