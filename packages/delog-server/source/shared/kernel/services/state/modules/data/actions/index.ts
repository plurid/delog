// #region imports
    // #region external
    import * as Types from '../types';
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


export const addEntities = (
    payload: Types.AddEntitiesPayload,
): Types.AddEntitiesAction => {
    return {
        type: Types.ADD_ENTITIES,
        payload,
    };
}


export const removeEntities = (
    payload: Types.RemoveEntitiesPayload,
): Types.RemoveEntitiesAction => {
    return {
        type: Types.REMOVE_ENTITIES,
        payload,
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
    addEntities,
    removeEntities,
    clearData,
};
// #endregion module



// #region exports
export default actions;
// #endregion exports
