// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledNotifier {
    theme: Theme;
}

export const StyledNotifier = styled.div<IStyledNotifier>`
    display: grid;
    place-content: center;
    text-align: center;
    min-height: 700px;
`;


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
    padding: 1.5rem;
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
                return theme.boxShadowUmbra;
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
