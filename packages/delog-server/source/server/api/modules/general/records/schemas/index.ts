// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getRecords(input: InputQuery): ResponseRecords!
    }
`;


export const mutations = gql`
    extend type Mutation {
        delogMutationRecord(input: DelogInputRecord!): Response!
        obliterateRecord(input: InputValueString!): Response!
    }
`;


export const types = gql`
    type ResponseRecords {
        status: Boolean!
        error: Error
        data: [Record!]
    }

    type Record {
        id: String!

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

        log: String!
    }

    type DelogContext {
        mode: String
        suite: String
        scenario: String
    }
`;


export const inputs = gql`
    input InputQuery {
        count: Int
        start: String
    }

    input DelogInputRecord {
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
