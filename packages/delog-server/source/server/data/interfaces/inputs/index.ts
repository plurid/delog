// #region module
export interface InputOf<T> {
    input: T;
}


export interface InputValueString {
    value: string;
}


export interface InputQuery {
    count?: number;
    start?: string;
}


export interface InputGenerateToken {
    name: string;
}


export interface InputGenerateSpace {
    name: string;
    project: string;
}


export interface InputGenerateFormat {
    identifier: string;
    transform: string;
}


export interface InputGenerateNotifier {
    name: string;
    notifyOn: string[];
    type: string;
    data: string;
}


export interface InputGenerateTester {
    project: string;
    suite: string;
    scenario: string;
    configuration: string;
}


export interface InputObliterateRecords {
    filter?: string;
    ids?: string[];
}



export interface InputGetAnalyticsLastPeriod {
    project: string;
    period: string;
    type: string;
}

export interface InputGetAnalyticsLastPeriodData {
    project: string;
    period: string;
}


export interface InputGetAnalyticsSize {
    project: string;
}
// #endregion module
