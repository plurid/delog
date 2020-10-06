// #region imports
    // #region libraries
    import {
        Project,
        ClientToken,
        Space,
        Format,
        ClientNotifier,
        Tester,
        LoggedRecord,
        Test,
    } from '#server/data/interfaces';
    // #endregion libraries


    // #region exports
    import {
        AnalyticsRecordsCount,
        AnalyticsSize,
    } from '#kernel-data/interfaces';
    // #endregion exports
// #endregion imports



// #region module
export type AddableEntityType =
    | 'project'
    | 'token'
    | 'space'
    | 'format'
    | 'notifier'
    | 'tester'
    | 'record'
    | 'test';

export const ADD_ENTITY = 'ADD_ENTITY';
export interface AddEntityPayload {
    type: AddableEntityType;
    data: any;
}
export interface AddEntityAction {
    type: typeof ADD_ENTITY;
    payload: AddEntityPayload;
}


export type RemovableEntityType =
    | 'project'
    | 'token'
    | 'space'
    | 'format'
    | 'notifier'
    | 'tester'
    | 'record'
    | 'test';

export const REMOVE_ENTITY = 'REMOVE_ENTITY';
export interface RemoveEntityPayload {
    type: RemovableEntityType;
    id: string;
}
export interface RemoveEntityAction {
    type: typeof REMOVE_ENTITY;
    payload: RemoveEntityPayload;
}


export type AddableEntitiesType =
    | 'projects'
    | 'tokens'
    | 'spaces'
    | 'formats'
    | 'notifiers'
    | 'testers'
    | 'records'
    | 'tests'
    | 'analytics.entries'
    | 'analytics.faults'
    | 'analytics.size';

export const ADD_ENTITIES = 'ADD_ENTITIES';
export interface AddEntitiesPayload {
    type: AddableEntitiesType;
    data: any;
    push?: string;
}
export interface AddEntitiesAction {
    type: typeof ADD_ENTITIES;
    payload: AddEntitiesPayload;
}


export type RemoveableEntitiesType =
    | 'records';

export const REMOVE_ENTITIES = 'REMOVE_ENTITIES';
export interface RemoveEntitiesPayload {
    type: RemoveableEntitiesType;
    ids: string[];
}
export interface RemoveEntitiesAction {
    type: typeof REMOVE_ENTITIES;
    payload: RemoveEntitiesPayload;
}


export const CLEAR_DATA = 'CLEAR_DATA';
export interface ClearDataAction {
    type: typeof CLEAR_DATA;
    payload: undefined;
}


export interface State {
    analytics: {
        entries: AnalyticsRecordsCount;
        faults: AnalyticsRecordsCount;
        size: AnalyticsSize;
    },
    projects: Project[];
    tokens: ClientToken[];
    spaces: Space[];
    formats: Format[];
    notifiers: ClientNotifier[];
    testers: Tester[];
    records: LoggedRecord[];
    tests: Test[];
}


export type Actions =
    | AddEntityAction
    | RemoveEntityAction
    | AddEntitiesAction
    | RemoveEntitiesAction
    | ClearDataAction;
// #endregion module
