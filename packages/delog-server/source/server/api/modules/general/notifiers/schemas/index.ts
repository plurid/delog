// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getNotifiers: ResponseNotifiers!
    }
`;


export const mutations = gql`
    extend type Mutation {
        generateNotifier(input: InputGenerateNotifier!): ResponseNotifier!
        obliterateNotifier(input: InputValueString!): Response!
    }
`;


export const types = gql`
    type ResponseNotifier {
        status: Boolean!
        error: Error
        data: Notifier
    }

    type ResponseNotifiers {
        status: Boolean!
        error: Error
        data: [Notifier!]
    }

    type Notifier {
        id: String!
        notifyOn: [String!]!
        type: String!
        data: String!
    }
`;


export const inputs = gql`
    input InputGenerateNotifier {
        notifyOn: [String!]!
        type: String!
        data: String!
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
