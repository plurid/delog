// #region imports
    // #region libraries
    import {
        Notifier,
    } from '../notifier';
    // #endregion libraries
// #endregion imports



// #region module
export interface Project {
    id: string;
    name: string;

    // generatedBy: string;
    // generatedAt: number;
    // sharedWith: ProjectSharer[];
}

export type ProjectEntityAccess =
    | 'CAN_READ'
    | 'CAN_WRITE';

export interface ProjectSharer {
    id: string;
    access: {
    };
}


export interface Token {
    id: string;
    value: string;
    ownedBy: string;
}

export type ClientToken = Omit<Token, 'value'> & {
    startsWith: string;
}


export interface Space {
    id: string;
    name: string;
    ownedBy: string;
}


export interface Format {
    id: string;
    value: string;
    ownedBy: string;
}


export interface Tester {
    id: string;
}


export interface Record {
    id: string;
}


export interface Record {
    id: string;
}


export interface Test {
    id: string;
}


export interface DelogOwner {
    id: string;
    projects: Project[];
    records: any[];
}


export interface OwnerToken {
    token: string;
}
// #endregion module
