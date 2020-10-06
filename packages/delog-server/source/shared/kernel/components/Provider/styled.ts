// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledProvider {
    theme: Theme;
}

export const StyledProvider = styled.div<IStyledProvider>`
    display: grid;
    place-content: center;
    text-align: center;
    min-height: 700px;
`;
// #endregion module
