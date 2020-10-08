// #region imports
    // #region libraries
    import styled from 'styled-components';
    // #endregion libraries
// #endregion imports



// #region module
export const StyledRecord = styled.div`
    font-family: 'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        'Open Sans', 'Helvetica Neue', sans-serif;

    padding: 4rem;

    h1 {
        font-size: 2.5rem;
        font-weight: normal;
        margin: 0;
        margin-bottom: 0.5rem;
    }

    h2 {
        font-size: 1.2rem;
        font-weight: normal;
        margin: 0;
    }
`;


export const StyledRecordLogFormat = styled.div`
    margin-bottom: 2rem;
`;


export const StyledRecordLevelTime = styled.div`
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 100px 1fr;
`;


export const StyledRecordProjectSpaceMethod = styled.div`
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 200px 200px 200px;
`;


export const StyledRecordErrorExtradata = styled.div`
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0.5rem;
`;


export const StyledRecordContext = styled.div`
`;

export const StyledRecordContextGroup = styled.div`
    display: flex;
`;
// #endregion module
