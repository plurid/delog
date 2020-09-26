// #region imports
    // #region external
    import delog from '../';
    // #endregion external
// #endregion imports



// #region module
const endpoint = 'http://localhost:56965/delog';
const token = '__TESTS__';


describe('delog - simple', () => {
    it('works', () => {
        delog({
            endpoint,
            token,
            text: 'works',
        });
    });
});
// #endregion module
