// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getTesters: ResponseTesters!
    }
`;


export const mutations = gql`
    extend type Mutation {
        generateTester(input: InputGenerateTester!): ResponseTester!
        obliterateTester(input: InputValueString!): Response!
    }
`;


export const types = gql`
    type ResponseTester {
        status: Boolean!
        error: Error
        data: Tester
    }

    type ResponseTesters {
        status: Boolean!
        error: Error
        data: [Tester!]
    }

    type Tester {
        id: String!
        name: String!
    }
`;


export const inputs = gql`
    input InputGenerateTester {

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
