// #region imports
    // #region external
    import delog from '../';

    import {
        delogLevels,
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

            level: delogLevels.error,
            method: 'method-name',
            format: '%TIME %TEXT',
            sharedID: 'one',
            sharedOrder: 0,
            extradata: JSON.stringify({one: 'two'}),

            text: 'works',
        });
    });



    it.only('works - with caller', () => {
        delog({
            endpoint,
            token,

            project: 'project-name',
            space: 'space-name',

            level: delogLevels.error,
            method: 'method-name',
            format: '%TIME %TEXT',
            sharedID: 'one',
            sharedOrder: 0,
            extradata: JSON.stringify({one: 'two'}),

            text: 'works',

            context: {
                call: {
                    codeProvider: 'codeProvider-test',
                    repositoryBasePath: '',
                    repositoryName: 'one',
                },
            },
        });
    });



    it('works - stress test', () => {
        for (let i = 0; i < 50; i++) {
            delog({
                endpoint,
                token,

                project: 'project-name',
                space: 'space-name',

                level: delogLevels.trace,
                method: 'method-name',
                format: '%LEVEL %TIME %TEXT',
                sharedID: 'one',
                sharedOrder: 0,
                extradata: JSON.stringify({one: 'two'}),

                text: 'works ' + i,
            });
        }
    });



    it('works - stress test timeout', async () => {
        jest.setTimeout(60000);

        for (let i = 0; i < 30; i++) {
            await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    delog({
                        endpoint,
                        token,

                        project: 'project-name',
                        space: 'space-name',

                        level: delogLevels.trace,
                        method: 'method-name',
                        format: '%LEVEL %TIME %TEXT',
                        sharedID: 'one',
                        sharedOrder: 0,
                        extradata: JSON.stringify({one: 'two'}),

                        text: 'works ' + i,
                    });

                    resolve();
                }, 1000);
            })
        }
    });
});
// #endregion module
