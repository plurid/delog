// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getSpaces: ResponseSpaces!
    }
`;


export const mutations = gql`
    extend type Mutation {
        generateSpace(input: InputGenerateSpace!): ResponseSpace!
        obliterateSpace(input: InputValueString!): Response!
    }
`;


export const types = gql`
    type ResponseSpace {
        status: Boolean!
        error: Error
        data: Space
    }

    type ResponseSpaces {
        status: Boolean!
        error: Error
        data: [Space!]
    }

    type Space {
        id: String!
        name: String!
        project: String!
    }

    extend type Owner {
        spaces: [Space!]!
    }
`;


export const inputs = gql`
    input InputGenerateSpace {
        name: String!
        project: String!
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
