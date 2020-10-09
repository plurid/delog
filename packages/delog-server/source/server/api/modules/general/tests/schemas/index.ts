// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getTests(input: InputQuery): ResponseTests!
    }
`;


export const mutations = gql`
    extend type Mutation {
        obliterateTest(input: InputValueString!): Response!
    }
`;


export const types = gql`
    type ResponseTest {
        status: Boolean!
        error: Error
        data: Test
    }

    type ResponseTests {
        status: Boolean!
        error: Error
        data: [Test!]
    }

    type Test {
        id: String!
        time: Int!
        status: String!
        tester: String!
    }
`;
// #endregion module



// #region exports
export default gql`
    ${queries}
    ${types}
    ${mutations}
`;
// #endregion exports
