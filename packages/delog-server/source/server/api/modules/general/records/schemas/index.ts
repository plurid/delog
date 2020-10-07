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

        text: String!
        time: Int!
        log: String!
        level: Int!

        project: String!
        space: String!

        format: String!

        method: String
        error: String
        extradata: String
        context: DelogContext
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
        repository: DelogContextRepository!
        caller: DelogContextCaller!
    }

    type DelogContextRepository {
        provider: String!
        name: String!
        branch: String!
        commit: String!
        basePath: String!
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
        repository: DelogInputContextRepository!
        caller: DelogInputContextCaller!
    }

    input DelogInputContextRepository {
        provider: String!
        name: String!
        branch: String!
        commit: String!
        basePath: String!
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
