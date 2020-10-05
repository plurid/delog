// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getAnalyticsLastPeriod(input: InputGetAnalyticsLastPeriod!): ResponseAnalyticsLastPeriod!
    }
`;



export const types = gql`
    type ResponseAnalyticsLastPeriod {
        status: Boolean!
        error: Error
        data: AnalyticsLastPeriod
    }

    type AnalyticsLastPeriod {
        fatal: Int
        error: Int
        warn: Int
        info: Int
        debug: Int
        trace: Int
    }
`;


export const inputs = gql`
    input InputGetAnalyticsLastPeriod {
        project: String!
        period: String!
        type: String!
    }
`;
// #endregion module



// #region exports
export default gql`
    ${queries}
    ${types}
    ${inputs}
`;
// #endregion exports
