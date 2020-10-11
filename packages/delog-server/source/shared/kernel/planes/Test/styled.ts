// #region imports
    // #region libraries
    import styled from 'styled-components';
    // #endregion libraries
// #endregion imports



// #region module
export const StyledTest = styled.div`
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


export const StyledTestPhases = styled.div`
    margin-top: 2rem;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        /* cursor: pointer; */
        padding: 0.7rem 0;
    }
`;
// #endregion module
