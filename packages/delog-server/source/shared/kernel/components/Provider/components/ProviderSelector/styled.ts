// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledProviderSelector {
    theme: Theme;
}

export const StyledProviderSelector = styled.div<IStyledProviderSelector>`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
`;
// #endregion module
