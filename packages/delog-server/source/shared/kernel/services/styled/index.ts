// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        PluridTextline,
        PluridPureButton,
        PluridLinkButton,
    } from '@plurid/plurid-ui-react';
    // #endregion libraries
// #endregion imports



// #region module
export const StyledH1 = styled.h1`
    margin-bottom: 2rem;
`;


export const StyledPluridTextline = styled(PluridTextline)`
    width: 350px;
`;


export const StyledPluridPureButton = styled(PluridPureButton)`
    margin: 1rem auto;
    margin-top: 4rem;
    width: 250px;
`;


export const StyledPluridLinkButton = styled(PluridLinkButton)`
    display: grid;
    place-content: center;
    margin: 30px auto;
`;
// #endregion module
