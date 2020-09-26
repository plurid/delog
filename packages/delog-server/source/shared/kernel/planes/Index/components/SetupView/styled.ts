// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        PluridPureButton,
        PluridTextline,
    } from '@plurid/plurid-ui-react';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledSetupView {
}

export const StyledSetupView = styled.div<IStyledSetupView>`
    min-height: 500px;
    display: grid;
    place-content: center;
    padding: 3rem;

    h1 {
        font-size: 1.3rem;
        margin: 1.5rem;
    }

    h2 {
        font-size: 1.1rem;
        margin: 1.5rem;
    }
`;



export const StyledPluridTextline = styled(PluridTextline)`
    margin: 20px auto;
    width: 350px;
`;


export const StyledPluridPureButton = styled(PluridPureButton)`
    margin: 20px auto;
    width: 250px;
`;
// #endregion module
