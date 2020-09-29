// #region imports
    // #region libraries
    import {
        DelogInputRecord,
    } from '@plurid/delog';
    // #endregion libraries


    // #region external
    import {
        Notifier,
    } from '../notifier';
    // #endregion external
// #endregion imports



// #region module
export interface Project {
    id: string;
    name: string;
    ownedBy: string;

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
    name: string;
    value: string;
    ownedBy: string;
    startsWith: string;
}

export type ClientToken = Omit<Token, 'value' | 'ownedBy'>;


export interface Space {
    id: string;
    name: string;
    project: string;
    ownedBy: string;
}


export interface Format {
    id: string;
    identifier: string;
    transform: string;
    ownedBy: string;
}


export interface Tester {
    id: string;
    suite: string;
    scenario: string;
    configuration: string,
    ownedBy: string;
}


export type Record = DelogInputRecord & {
    id: string;
    text: string;

    ownedBy: string;
}


export type LoggedRecord = Record & {
    log: string;
}


export interface Test {
    id: string;
    status: string;
    tester: string;
    ownedBy: string;
}


export interface DelogOwner {
    id: string;
    tokens: Token[];
    projects: Project[];
    spaces: Space[];
    formats: Format[];
    notifiers: any[];
    testers: Tester[];
}


export interface OwnerToken {
    token: string;
}
// #endregion module
