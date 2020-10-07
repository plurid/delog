// #region imports
    // #region internal
    import {
        delog,
    } from './functions';

    import {
        stringifyError,
    } from './services/utilities';
    // #endregion internal
// #endregion imports



// #region exports
export * from './data/interfaces';
export * from './data/constants';

export {
    stringifyError,
};

export default delog;
// #endregion exports
