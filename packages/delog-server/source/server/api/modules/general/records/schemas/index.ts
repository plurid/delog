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
        obliterateRecords(input: InputObliterateRecords): Response!
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
        sharedID: String
        sharedOrder: Int
        call: DelogContextCall
    }

    type DelogContextCall {
        provider: String!
        repository: String!
        caller: DelogContextCaller!
    }

    type DelogContextCaller {
        file: String!
        line: Int!
        column: Int!
    }
`;


export const inputs = gql`
    input InputQuery {
        count: Int
        start: String
    }

    input DelogInputRecord {
        text: String!
        time: Int!
        level: Int!

        project: String!
        space: String!

        format: String!

        method: String
        error: String
        extradata: String
        context: DelogInputContext
    }

    input DelogInputContext {
        mode: String
        suite: String
        scenario: String
        sharedID: String
        sharedOrder: Int
        call: DelogInputContextCall
    }

    input DelogInputContextCall {
        provider: String!
        repository: String!
        caller: DelogInputContextCaller!
    }

    input DelogInputContextCaller {
        file: String!
        line: Int!
        column: Int!
    }

    input InputObliterateRecords {
        filter: String
        ids: [String!]
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
