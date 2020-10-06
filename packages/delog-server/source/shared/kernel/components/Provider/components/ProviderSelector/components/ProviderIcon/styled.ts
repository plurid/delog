// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledProviderIcon {
    theme: Theme;
    selected: boolean;
}

export const StyledProviderIcon = styled.div<IStyledProviderIcon>`
    display: grid;
    place-content: center;
    padding: 1rem;
    margin: 1rem 0;
    cursor: pointer;
    user-select: none;

    background-color: ${
        ({
            theme,
            selected,
        }: IStyledProviderIcon) => {
            if (selected) {
                return theme.backgroundColorTertiary;
            }

            return 'initial';
        }
    };
    box-shadow: ${
        ({
            theme,
            selected,
        }: IStyledProviderIcon) => {
            if (selected) {
                return theme.boxShadowUmbra;
            }

            return 'initial';
        }
    };
`;
// #endregion module
