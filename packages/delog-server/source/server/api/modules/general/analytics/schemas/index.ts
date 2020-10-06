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

    extend type Owner {
        analytics: OwnerAnalytics!
    }

    type OwnerAnalytics {
        entries(input: InputGetAnalyticsLastPeriodData): AnalyticsRecordsCount!
        faults(input: InputGetAnalyticsLastPeriodData): AnalyticsRecordsCount!
    }

    type AnalyticsRecordsCount {
        project: String!
        period: String!
        data: [AnalyticsRecordData!]!
    }

    type AnalyticsRecordData {
        name: String!
        value: Int!
    }
`;


export const inputs = gql`
    input InputGetAnalyticsLastPeriod {
        project: String!
        period: String!
        type: String!
    }

    input InputGetAnalyticsLastPeriodData {
        project: String!
        period: String!
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
