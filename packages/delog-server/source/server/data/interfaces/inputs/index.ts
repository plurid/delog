// #region module
export interface InputOf<T> {
    input: T;
}


export interface InputValueString {
    value: string;
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
    notifyOn: string[];
    type: string;
    data: string;
}
// #endregion module
