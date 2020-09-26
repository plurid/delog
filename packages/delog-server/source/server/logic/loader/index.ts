// #region imports
    // #region external
    import {
        Project,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
export const loadProjects = async () => {
    const projects: Project[] = await database.getAll('projects');

    return projects || [];
}



const loadData = async () => {
    const projects = await loadProjects();

    const data = {
        projects,
    };

    return data;
}
// #endregion module



// #region exports
export default loadData;
// #endregion exports
