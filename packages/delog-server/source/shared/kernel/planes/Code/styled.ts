// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledCode {
    theme: Theme;
}

export const StyledCode = styled.div<IStyledCode>`
    font-family: 'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        'Open Sans', 'Helvetica Neue', sans-serif;
    padding: 2rem;

    textarea {
        border: none;
        outline: none;
        padding: 2rem;
        width: 100%;
        height: 500px;
        resize: none;
        line-height: 1.6;
        font-size: 1rem;
        font-family: 'Source Code Pro', 'Courier New', Courier, monospace;

        color: ${
            ({
                theme,
            }: IStyledCode) => theme.colorPrimary
        };
        background-color: ${
            ({
                theme,
            }: IStyledCode) => theme.backgroundColorTertiary
        };
        box-shadow: ${
            ({
                theme,
            }: IStyledCode) => theme.boxShadowUmbraInset
        };
    }
`;
// #endregion module
