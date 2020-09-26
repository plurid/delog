// #region imports
    // #region libraries
    import {
        Project,
    } from '#server/data/interfaces';
    // #endregion libraries
// #endregion imports



// #region module
export type AddableEntityType =
    | 'project';

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
    | 'project';

export const REMOVE_ENTITY = 'REMOVE_ENTITY';
export interface RemoveEntityPayload {
    type: RemovableEntityType;
    id: string;
}
export interface RemoveEntityAction {
    type: typeof REMOVE_ENTITY;
    payload: RemoveEntityPayload;
}


export const SET_PROJECTS = 'SET_PROJECTS';
export interface SetProjectsAction {
    type: typeof SET_PROJECTS;
    payload: Project[];
}


export const CLEAR_DATA = 'CLEAR_DATA';
export interface ClearDataAction {
    type: typeof CLEAR_DATA;
    payload: undefined;
}



export interface State {
    projects: Project[];
}


export type Actions =
    | AddEntityAction
    | RemoveEntityAction
    | SetProjectsAction
    | ClearDataAction;
// #endregion module
