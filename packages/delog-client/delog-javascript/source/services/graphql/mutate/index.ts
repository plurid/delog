// #region imports
    // #region libraries
    import {
        gql,
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
const LOG = gql`
    mutation LOG($input: DelogInputLog!) {
        status
    }
`;
// #endregion module



// #region exports
export {
    LOG,
};
// #endregion exports
