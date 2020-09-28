// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getFormats: ResponseFormats!
    }
`;


export const mutations = gql`
    extend type Mutation {
        generateFormat(input: InputGenerateFormat!): ResponseFormat!
        obliterateFormat(input: InputValueString!): Response!
    }
`;


export const types = gql`
    type ResponseFormat {
        status: Boolean!
        error: Error
        data: Format
    }

    type ResponseFormats {
        status: Boolean!
        error: Error
        data: [Format!]
    }

    type Format {
        id: String!
        identifier: String!
        transform: String!
    }

    extend type Owner {
        formats: [Format!]!
    }
`;


export const inputs = gql`
    input InputGenerateFormat {
        identifier: String!
        transform: String!
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
