// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledToken {
    theme: Theme;
}

export const StyledToken = styled.div<IStyledToken>`
    display: grid;
    place-content: center;
    text-align: center;
    min-height: 700px;
`;


export const StyledTokenValue = styled.div`
    font-size: 1.1rem;
    line-height: 2;
`;
// #endregion module
