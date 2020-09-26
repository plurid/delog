// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const GET_SETUP = gql`
    query GetSetup {
        getSetup {
            status
            error {
                type
                path
                message
            }
            data {
                projects {
                    id
                    name
                }
            }
        }
    }
`;


export const GET_CURRENT_OWNER = gql`
    query GetCurrentOwner {
        getCurrentOwner {
            status
            error {
                path
                type
                message
            }
            data {
                id
            }
        }
    }
`;


export const GET_USAGE_TYPE = gql`
    query GetUsageType {
        getUsageType {
            status
            error {
                path
                type
                message
            }
            data
        }
    }
`;
// #endregion module
