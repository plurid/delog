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


export interface DelogOwner {
    id: string;
    projects: Project[];
    records: any[];
}


export interface OwnerToken {
    token: string;
}
// #endregion module
