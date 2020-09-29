// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const GENERATE_PROJECT = gql`
    mutation GenerateProject($input: InputValueString!) {
        generateProject(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                name
            }
        }
    }
`;


export const OBLITERATE_PROJECT = gql`
    mutation ObliterateProject($input: InputValueString!) {
        obliterateProject(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const GENERATE_TOKEN = gql`
    mutation GenerateToken($input: InputGenerateToken!) {
        generateToken(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                name
                value
                startsWith
            }
        }
    }
`;


export const OBLITERATE_TOKEN = gql`
    mutation ObliterateToken($input: InputValueString!) {
        obliterateToken(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const GENERATE_SPACE = gql`
    mutation GenerateSpace($input: InputGenerateSpace!) {
        generateSpace(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                name
                project
            }
        }
    }
`;


export const OBLITERATE_SPACE = gql`
    mutation ObliterateSpace($input: InputValueString!) {
        obliterateSpace(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const GENERATE_FORMAT = gql`
    mutation GenerateFormat($input: InputGenerateFormat!) {
        generateFormat(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                identifier
                transform
            }
        }
    }
`;


export const OBLITERATE_FORMAT = gql`
    mutation ObliterateFormat($input: InputValueString!) {
        obliterateFormat(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const GENERATE_NOTIFIER = gql`
    mutation GenerateNotifier($input: InputGenerateNotifier!) {
        generateNotifier(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                notifyOn
                type
                data
            }
        }
    }
`;


export const OBLITERATE_NOTIFIER = gql`
    mutation ObliterateNotifier($input: InputValueString!) {
        obliterateNotifier(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const GENERATE_TESTER = gql`
    mutation GenerateTester($input: InputGenerateTester!) {
        generateTester(input: $input) {
            status
            error {
                type
                path
                message
            }
            data {
                id
                name
            }
        }
    }
`;


export const OBLITERATE_TESTER = gql`
    mutation ObliterateTester($input: InputValueString!) {
        obliterateTester(input: $input) {
            status
            error {
                type
                path
                message
            }
        }
    }
`;


export const LOGIN = gql`
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


export const LOGOUT = gql`
    mutation Logout {
        logout {
            status
            error {
                type
                path
                message
            }
        }
    }
`;
// #endregion module
