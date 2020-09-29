// #region imports
    // #region external
    import delog from '../';

    import {
        logLevels,
    } from '#data/constants';
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

            project: 'project-name',
            space: 'space-name',

            level: logLevels.trace,
            method: 'method-name',
            format: '%TIME %TEXT',
            sharedID: 'one',
            sharedOrder: 0,
            extradata: JSON.stringify({one: 'two'}),

            text: 'works',
        });
    });


    it.only('works - stress test', () => {
        for (let i = 0; i < 50; i++) {
            delog({
                endpoint,
                token,

                project: 'project-name',
                space: 'space-name',

                level: logLevels.trace,
                method: 'method-name',
                format: '%TIME %TEXT',
                sharedID: 'one',
                sharedOrder: 0,
                extradata: JSON.stringify({one: 'two'}),

                text: 'works ' + i,
            });
        }
    });
});
// #endregion module
