// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledRecordsSize {
    theme: Theme;
}

const StyledRecordsSize = styled.div<IStyledRecordsSize>`
    display: grid;
    grid-template-columns: auto 1fr 16px;
    grid-gap: 0.5rem;
    width: 500px;
    min-height: 90px;
    align-items: center;
    padding: 2rem;

    background-color: ${
        ({
            theme,
        }: IStyledRecordsSize) => theme.backgroundColorSecondary
    };
    box-shadow: ${
        ({
            theme,
        }: IStyledRecordsSize) => theme.boxShadowUmbra
    };
`;


const StyledRecordsSizeData = styled.div`
`;
// #endregion module



// #region exports
export {
    StyledRecordsSize,
    StyledRecordsSizeData,
};
// #endregion exports
