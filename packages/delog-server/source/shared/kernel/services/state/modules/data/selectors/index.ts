// #region imports
    // #region external
    import {
        AppState,
    } from '../../../store';
    // #endregion external
// #endregion imports



// #region module
const getProjects = (state: AppState) => state.data.projects;



const selectors = {
    getProjects,
};
// #endregion module



// #region exports
export default selectors;
// #endregion exports
