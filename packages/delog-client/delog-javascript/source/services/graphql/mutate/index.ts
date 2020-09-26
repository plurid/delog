// #region imports
    // #region libraries
    import {
        gql,
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
const LOG = gql`
    mutation DelogMutationLog($input: DelogInputLog!) {
        delogMutationLog(input: $input) {
            status
        }
    }
`;
// #endregion module



// #region exports
export {
    LOG,
};
// #endregion exports
