// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getLogs: ResponseLogs!
    }
`;


export const mutations = gql`
    extend type Mutation {
        delogMutationLog(input: DelogInputLog!): Response!
    }
`;


export const types = gql`
    type ResponseLogs {
        status: Boolean!
        error: Error
        data: [Log!]
    }

    type Log {
        format: String!

        project: String!
        space: String!

        level: Int!
        method: String!
        sharedID: String!
        sharedOrder: Int!
        error: String!
        extradata: String!

        context: DelogContext

        text: String!

        time: Int!
    }

    type DelogContext {
        mode: String
        suite: String
        scenario: String
    }
`;


export const inputs = gql`
    input DelogInputLog {
        format: String!

        project: String!
        space: String!

        level: Int!
        method: String!
        sharedID: String!
        sharedOrder: Int!
        error: String!
        extradata: String!

        context: DelogInputContext

        text: String!

        time: Int!
    }

    input DelogInputContext {
        mode: String
        suite: String
        scenario: String
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
