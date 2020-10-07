// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const mutations = gql`
    extend type Mutation {
        addProvider(input: InputAddProvider!): ResponseProvider!
        obliterateProvider(input: InputValueString!): Response!
    }
`;


export const types = gql`
    type ResponseProvider {
        status: Boolean!
        error: Error
        data: Provider
    }

    type Provider {
        id: ID!
        name: String!
        type: String!
    }

    extend type Owner {
        providers: [Provider!]!
    }
`;


export const inputs = gql`
    input InputAddProvider {
        type: String!
        token: String!
        name: String!
    }
`;
// #endregion module



// #region exports
export default gql`
    ${mutations}
    ${types}
    ${inputs}
`;
// #endregion exports
