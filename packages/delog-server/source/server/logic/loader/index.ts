// #region imports
    // #region external
    import {
        Project,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
export const loadProjects = async (
    ownerID: string
) => {
    const projects: Project[] = await database.query(
        'projects',
        'ownedBy',
        ownerID,
    );

    return projects;
}



const loadData = async (
    ownerID: string | undefined,
) => {
    if (!ownerID) {
        return {
            projects: [],
        };
    }

    const projects = await loadProjects(
        ownerID,
    );

    const data = {
        projects,
    };

    return data;
}
// #endregion module



// #region exports
export default loadData;
// #endregion exports
