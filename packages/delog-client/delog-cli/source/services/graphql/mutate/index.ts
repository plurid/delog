// #region imports
    // #region libraries
    import {
        gql,
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
const LOGIN = gql`
    mutation Login($input: InputLogin!) {
        login(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
            }
        }
    }
`;


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
    LOGIN,
    RECORD,
};
// #endregion exports
