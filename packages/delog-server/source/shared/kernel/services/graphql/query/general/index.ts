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
                analytics {
                    entries {
                        project
                        period
                        data {
                            name
                            value
                        }
                    }
                    faults {
                        project
                        period
                        data {
                            name
                            value
                        }
                    }
                }
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
                testers {
                    id
                    suite
                    scenario
                    configuration
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


export const GET_RECORDS = gql`
    query GetRecords($input: InputQuery) {
        getRecords(input: $input) {
            status
            error {
                path
                type
                message
            }
            data {
                id

                text
                time
                level
                log

                project
                space

                format

                method
                error
                extradata
                context {
                    mode
                    suite
                    scenario
                }
            }
        }
    }
`;


export const GET_TESTS = gql`
    query GetTests {
        getTests {
            status
            error {
                path
                type
                message
            }
            data {
                id
                status
                tester
            }
        }
    }
`;
// #endregion module
