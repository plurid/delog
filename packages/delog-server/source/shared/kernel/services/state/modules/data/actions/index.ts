// #region imports
    // #region external
    import * as Types from '../types';

    import {
        Project,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const addEntity = (
    payload: Types.AddEntityPayload,
): Types.AddEntityAction => {
    return {
        type: Types.ADD_ENTITY,
        payload,
    };
}


export const removeEntity = (
    payload: Types.RemoveEntityPayload,
): Types.RemoveEntityAction => {
    return {
        type: Types.REMOVE_ENTITY,
        payload,
    };
}


export const setProjects = (
    projects: Project[],
): Types.SetProjectsAction => {
    return {
        type: Types.SET_PROJECTS,
        payload: projects,
    };
}


export const clearData = (): Types.ClearDataAction => {
    return {
        type: Types.CLEAR_DATA,
        payload: undefined,
    };
}



const actions = {
    addEntity,
    removeEntity,
    setProjects,
    clearData,
};
// #endregion module



// #region exports
export default actions;
// #endregion exports
