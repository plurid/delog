// #region imports
    // #region libraries
    import {
        gql,
        DocumentNode,
    } from '@apollo/client';
    // #endregion libraries


    // #region internal
    import General from './general/schemas';
    // #endregion internal
// #endregion imports



// #region module
const baseSchema = gql`
    # default
    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }

    type Subscription {
        _: Boolean
    }


    # extras

    # types
    type Response {
        status: Boolean!
        error: Error
    }

    type Error {
        path: String!
        type: String!
        message: String!
    }


    # inputs
    input InputValueString {
        value: String!
    }
`;


const schemas: DocumentNode[] = [
    baseSchema,

    ...General,
];
// #endregion module



// #region exports
export default schemas;
// #endregion exports
