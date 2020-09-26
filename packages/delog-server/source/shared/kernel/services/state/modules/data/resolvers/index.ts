// #region imports
    // #region internal
    import * as Types from '../types';

    import initialState from '../initial';
    // #endregion internal
// #endregion imports



// #region module
export const addEntity = (
    state: Types.State,
    action: Types.AddEntityAction,
): Types.State => {
    const {
        type,
        data,
    } = action.payload;

    const newState = {
        ...state,
    };

    let projects = [
        ...newState.projects,
    ];


    switch (type) {
        case 'project':
            projects = [
                ...projects,
                {
                    ...data,
                },
            ]
            break;
    }

    return {
        ...newState,
        projects: [
            ...projects,
        ],
    };
}


export const removeEntity = (
    state: Types.State,
    action: Types.RemoveEntityAction,
): Types.State => {
    const {
        id,
        type,
    } = action.payload;

    const newState = {
        ...state,
    };

    let projects = [
        ...newState.projects,
    ];


    switch (type) {
        case 'project':
            projects = projects.filter(
                project => project.id !== id
            );
            break;
    }

    return {
        ...newState,
        projects: [
            ...projects,
        ],
    };
}


export const setProjects = (
    state: Types.State,
    action: Types.SetProjectsAction,
): Types.State => {
    return {
        ...state,
        projects: [
            ...action.payload,
        ],
    };
}


export const clearData = (
    state: Types.State,
    action: Types.ClearDataAction,
): Types.State => {
    return {
        ...initialState,
    };
}



const resolvers = {
    addEntity,
    removeEntity,
    setProjects,
    clearData,
};
// #endregion module



// #region exports
export default resolvers;
// #endregion exports
