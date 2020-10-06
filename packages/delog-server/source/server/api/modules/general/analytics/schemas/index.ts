// #region imports
    // #region libraries
    import gql from 'graphql-tag';
    // #endregion libraries
// #endregion imports



// #region module
export const queries = gql`
    extend type Query {
        getAnalyticsLastPeriod(input: InputGetAnalyticsLastPeriod!): ResponseAnalyticsLastPeriod!
        getAnalyticsSize(input: InputGetAnalyticsSize!): ResponseAnalyticsSize!
    }
`;



export const types = gql`
    type ResponseAnalyticsLastPeriod {
        status: Boolean!
        error: Error
        data: AnalyticsLastPeriod
    }

    type ResponseAnalyticsSize {
        status: Boolean!
        error: Error
        data: AnalyticsSize
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
        size(input: InputGetAnalyticsSize): AnalyticsSize!
    }

    type AnalyticsRecordsCount {
        project: String!
        period: String!
        data: [AnalyticsRecordData!]!
    }

    type AnalyticsSize {
        project: String!
        value: Int!
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

    input InputGetAnalyticsSize {
        project: String!
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
