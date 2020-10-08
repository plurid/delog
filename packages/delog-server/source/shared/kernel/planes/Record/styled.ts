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
        font-size: 2rem;
        font-weight: normal;
        margin: 0;
        line-height: 2;
        word-break: break-word;
    }

    h2 {
        font-size: 1.2rem;
        font-weight: normal;
        margin: 0;
    }
`;


export const StyledRecordLogFormat = styled.div`
    margin-bottom: 2.5rem;
`;


export const StyledRecordLevelTime = styled.div`
    margin-bottom: 2rem;
    display: flex;
`;


export const StyledRecordProjectSpaceMethod = styled.div`
    margin-bottom: 2rem;
    display: flex;
`;


export const StyledRecordErrorExtradata = styled.div`
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2rem;
`;


export const StyledRecordContext = styled.div`
`;

export const StyledRecordContextGroup = styled.div`
    display: flex;
`;
// #endregion module
