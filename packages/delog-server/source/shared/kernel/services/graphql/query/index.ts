// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
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
                projects {
                    id
                    name
                }
                tokens {
                    id
                    name
                    startsWith
                }
                spaces {
                    id
                    name
                    project
                }
                formats {
                    id
                    identifier
                    transform
                }
                notifiers {
                    id
                    name
                    notifyOn
                    type
                    data
                }
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
