// #region imports
    // #region libraries
    import {
        gql,
    } from '@apollo/client/core';
    // #endregion libraries
// #endregion imports



// #region module
const RECORD = gql`
    mutation DelogMutationRecord($input: DelogInputRecord!) {
        delogMutationRecord(input: $input) {
            status
        }
    }
`;
// #endregion module



// #region exports
export {
    RECORD,
};
// #endregion exports
