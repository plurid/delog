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
    justify-content: center;
    text-align: center;
    min-height: 700px;
    max-height: 700px;
    overflow: auto;
`;
// #endregion module
