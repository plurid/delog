// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getRepositories: ResponseRepositories!
        getProviderRepositories(input: InputValueString!): ResponseRepositories!
    }
`;


export const mutations = gql`
    extend type Mutation {
        linkRepository(input: InputLinkRepository!): ResponseRepository!
        delinkRepository(input: InputValueString!): Response!
    }
`;


export const types = gql`
    type ResponseRepository {
        status: Boolean!
        error: Error
        data: Repository
    }

    type ResponseRepositories {
        status: Boolean!
        error: Error
        data: [Repository!]
    }

    type Repository {
        id: ID!
        name: String!
        isPrivate: Boolean!
    }

    extend type Owner {
        repositories: [Repository!]!
    }
`;


export const inputs = gql`
    input InputLinkRepository {
        providerID: String!
        nameWithOwner: String!
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
