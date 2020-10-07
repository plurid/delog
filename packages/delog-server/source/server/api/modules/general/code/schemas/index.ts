// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getCode(input: InputGetCode!): ResponseCode!
    }
`;


export const types = gql`
    type ResponseFormat {
        status: Boolean!
        error: Error
        data: Code
    }

    type Code {
        lines: [String!]
    }
`;


export const inputs = gql`
    input InputGetCode {
        repository: InputGetCodeRepository!
        context: InputGetCodeContext!
    }

    input InputGetCodeRepository {
        provider: String!
        name: String!
        branch: String!
        commit: String!
    }

    input InputGetCodeContext {
        file: String!
        line: String!
        column: String!
    }
`;
// #endregion module



// #region exports
export default gql`
    ${queries}
    ${types}
    ${inputs}
`;
// #endregion exports
