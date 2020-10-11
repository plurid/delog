// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledTester {
    theme: Theme;
}

export const StyledTester = styled.div<IStyledTester>`
    display: grid;
    place-content: center;
    text-align: center;
    min-height: 700px;
`;


export const StyledTesterError = styled.div`
    margin: 2rem 0;
`;
// #endregion module
