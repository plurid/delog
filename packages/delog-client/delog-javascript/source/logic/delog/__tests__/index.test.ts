// #region imports
    // #region external
    import devlog from '../';
    // #endregion external
// #endregion imports



// #region module
const endpoint = 'http://localhost:56965/delog';
const token = '__TESTS__';


describe('devlog - simple', () => {
    it('works', () => {
        devlog({
            endpoint,
            token,
            text: 'works',
        });
    });
});
// #endregion module
