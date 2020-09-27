// #region imports
    // #region external
    import {
        AppState,
    } from '../../../store';
    // #endregion external
// #endregion imports



// #region module
const getProjects = (state: AppState) => state.data.projects;
const getTokens = (state: AppState) => state.data.tokens;
const getSpaces = (state: AppState) => state.data.spaces;
const getFormats = (state: AppState) => state.data.formats;
const getNotifiers = (state: AppState) => state.data.notifiers;
const getTesters = (state: AppState) => state.data.testers;
const getRecords = (state: AppState) => state.data.records;
const getTests = (state: AppState) => state.data.tests;

const selectors = {
    getProjects,
    getTokens,
    getSpaces,
    getFormats,
    getNotifiers,
    getTesters,
    getRecords,
    getTests,
};
// #endregion module



// #region exports
export default selectors;
// #endregion exports
