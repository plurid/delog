// #region imports
    // #region libraries
    import styled from 'styled-components';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries
// #endregion imports



// #region module
export interface IStyledRecordsPieChart {
    theme: Theme;
}

const StyledRecordsPieChart = styled.div<IStyledRecordsPieChart>`
    position: relative;

    background-color: ${
        ({
            theme,
        }: IStyledRecordsPieChart) => theme.backgroundColorSecondary
    };
    box-shadow: ${
        ({
            theme,
        }: IStyledRecordsPieChart) => theme.boxShadowUmbra
    };

    width: 500px;
    min-height: 400px;
`;


const StyledRecordsPieChartTitle = styled.div`
    padding: 2rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
`;


const StyledRecordsPieChartProject = styled.div`
    padding: 2rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
`;


const StyledRecordsPieChartRefresh = styled.div`
    position: absolute;
    top: 2rem;
    right: 2rem;
`;
// #endregion module



// #region exports
export {
    StyledRecordsPieChart,
    StyledRecordsPieChartTitle,
    StyledRecordsPieChartProject,
    StyledRecordsPieChartRefresh,
};
// #endregion exports
