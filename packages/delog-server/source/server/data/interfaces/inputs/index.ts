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


export interface InputGenerateFormat {
    identifier: string;
    transform: string;
}


export interface InputGenerateSpace {
    name: string;
    project: string;
}
// #endregion module
