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
    suite: string;
    scenario: string;
    configuration: string;
}
// #endregion module
