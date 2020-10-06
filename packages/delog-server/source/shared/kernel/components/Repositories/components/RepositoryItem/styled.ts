// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledRepositoryItem {
    theme: Theme;
}

export const StyledRepositoryItem = styled.div<IStyledRepositoryItem>`
    padding: 0.7rem;
    user-select: none;
    cursor: pointer;
    display: grid;
    align-items: center;
    grid-template-columns: 30px auto 30px;
    grid-gap: 0.3rem;

    :hover {
        background-color: ${
            ({
                theme,
            }: IStyledRepositoryItem) => theme.backgroundColorTertiary
        }
    }
`;


export const StyledRepositoryIcon = styled.div`
    display: grid;
    place-content: center;
`;
// #endregion module
