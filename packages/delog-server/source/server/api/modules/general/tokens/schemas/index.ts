// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getTokens: ResponseTokens!
    }
`;


export const mutations = gql`
    extend type Mutation {
        generateToken(input: InputGenerateToken!): ResponseToken!
        obliterateToken(input: InputValueString!): Response!
    }
`;


export const types = gql`
    type ResponseToken {
        status: Boolean!
        error: Error
        data: Token
    }

    type ResponseTokens {
        status: Boolean!
        error: Error
        data: [Token!]
    }

    type Token {
        id: ID!
        name: String!
        startsWith: String!
    }
`;


export const inputs = gql`
    input InputGenerateToken {
        name: String!
    }
`;
// #endregion module



// #region exports
export default gql`
    ${queries}
    ${mutations}
    ${types}
    ${inputs}
`;
// #endregion exports
