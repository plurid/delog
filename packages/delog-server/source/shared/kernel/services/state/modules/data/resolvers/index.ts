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
    let tokens = [
        ...newState.tokens,
    ];
    let spaces = [
        ...newState.spaces,
    ];
    let formats = [
        ...newState.formats,
    ];
    let notifiers = [
        ...newState.notifiers,
    ];
    let testers = [
        ...newState.testers,
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
        case 'token':
            tokens = [
                ...tokens,
                {
                    ...data,
                },
            ]
            break;
        case 'space':
            spaces = [
                ...spaces,
                {
                    ...data,
                },
            ]
            break;
        case 'format':
            formats = [
                ...formats,
                {
                    ...data,
                },
            ]
            break;
        case 'notifier':
            notifiers = [
                ...notifiers,
                {
                    ...data,
                },
            ]
            break;
        case 'tester':
            testers = [
                ...testers,
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
        tokens: [
            ...tokens,
        ],
        spaces: [
            ...spaces,
        ],
        formats: [
            ...formats,
        ],
        notifiers: [
            ...notifiers,
        ],
        testers: [
            ...testers,
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
    let tokens = [
        ...newState.tokens,
    ];
    let spaces = [
        ...newState.spaces,
    ];
    let formats = [
        ...newState.formats,
    ];
    let notifiers = [
        ...newState.notifiers,
    ];
    let testers = [
        ...newState.testers,
    ];


    switch (type) {
        case 'project':
            projects = projects.filter(
                project => project.id !== id
            );
        case 'token':
            tokens = tokens.filter(
                token => token.id !== id
            );
            break;
        case 'space':
            spaces = spaces.filter(
                space => space.id !== id
            );
            break;
        case 'format':
            formats = formats.filter(
                format => format.id !== id
            );
            break;
        case 'notifier':
            notifiers = notifiers.filter(
                notifier => notifier.id !== id
            );
            break;
        case 'tester':
            testers = testers.filter(
                tester => tester.id !== id
            );
            break;
    }

    return {
        ...newState,
        projects: [
            ...projects,
        ],
        tokens: [
            ...tokens,
        ],
        spaces: [
            ...spaces,
        ],
        formats: [
            ...formats,
        ],
        notifiers: [
            ...notifiers,
        ],
        testers: [
            ...testers,
        ],
    };
}


export const addEntities = (
    state: Types.State,
    action: Types.AddEntitiesAction,
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
    let tokens = [
        ...newState.tokens,
    ];
    let spaces = [
        ...newState.spaces,
    ];
    let formats = [
        ...newState.formats,
    ];
    let notifiers = [
        ...newState.notifiers,
    ];
    let testers = [
        ...newState.testers,
    ];


    switch (type) {
        case 'projects':
            projects = [
                ...data,
            ];
            break;
        case 'tokens':
            tokens = [
                ...data,
            ];
            break;
        case 'spaces':
            spaces = [
                ...data,
            ];
            break;
        case 'formats':
            formats = [
                ...data,
            ];
            break;
        case 'notifiers':
            notifiers = [
                ...data,
            ];
            break;
        case 'testers':
            testers = [
                ...data,
            ];
            break;
    }

    return {
        ...newState,
        projects: [
            ...projects,
        ],
        tokens: [
            ...tokens,
        ],
        spaces: [
            ...spaces,
        ],
        formats: [
            ...formats,
        ],
        notifiers: [
            ...notifiers,
        ],
        testers: [
            ...testers,
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
    addEntities,
    clearData,
};
// #endregion module



// #region exports
export default resolvers;
// #endregion exports
