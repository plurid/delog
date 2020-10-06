// #region module
export interface AnalyticsRecordData {
    name: string;
    value: number;
}

export interface AnalyticsRecordsCount {
    project: string;
    period: string;
    data: AnalyticsRecordData[];
}
// #endregion module
