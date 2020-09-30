// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
    // #endregion libraries
// #endregion imports



// #region module
export const StyledSelectors = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    height: 50px;
    place-content: center;
`;


export interface IStyledSelector {
    theme: Theme;
    selected: boolean;
}

export const StyledSelector = styled.div<IStyledSelector>`
    cursor: pointer;
    user-select: none;
    padding: 0.6rem;
    border-radius: 4rem;

    background-color: ${
        ({
            theme,
            selected,
        }: IStyledSelector) => {
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
        }: IStyledSelector) => {
            if (selected) {
                return `inset 0px 4px 4px ${theme.boxShadowUmbraColor}`;
            }

            return 'initial';
        }
    };

    :hover {
        background-color: ${
            ({
                theme,
            }: IStyledSelector) => theme.backgroundColorTertiary
        };
    }
`;
// #endregion module
