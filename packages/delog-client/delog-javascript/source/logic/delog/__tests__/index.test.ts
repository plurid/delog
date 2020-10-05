// #region imports
    // #region external
    import {
        DelogTestingContext,
    } from '#data/interfaces';

    import {
        delogLevels,
    } from '#data/constants';

    import delog from '../';
    // #endregion external
// #endregion imports



// #region module
const endpoint = 'http://localhost:56965/delog';
const token = '__TESTS__';


describe('delog - simple', () => {
    it('works', () => {
        delog({
            text: 'works',

            endpoint,
            token,

            project: 'project-name',
            space: 'space-name',

            level: delogLevels.error,
            method: 'method-name',
            format: '%TIME %TEXT',
            extradata: JSON.stringify({one: 'two'}),
        });
    });



    it('works - with caller', () => {
        delog({
            endpoint,
            token,

            project: 'project-name',
            space: 'space-name',

            level: delogLevels.error,
            method: 'method-name',
            format: '%TIME %TEXT',
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



    it.only('works - stress test', async () => {
        jest.setTimeout(60_000);

        for (let i = 0; i < 101; i++) {
            console.log('i', i);
            delog({
                text: 'works ' + i,

                endpoint,
                token,

                project: 'project-name',
                space: 'space-name',

                level: delogLevels.trace,
                method: 'method-name',
                format: '%LEVEL %TIME %TEXT',
                extradata: JSON.stringify({one: 'two'}),
            });
        }

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 10_000);
        });
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
                        extradata: JSON.stringify({one: 'two'}),

                        text: 'works ' + i,
                    });

                    resolve();
                }, 1000);
            })
        }
    });
});


describe('delog - tester', () => {
    it('simple tester', () => {
        const outsideFunction = (
            value: number,
            testContext?: DelogTestingContext,
        ) => {
            delog({
                endpoint,
                token,

                project: 'one',
                space: 'space-name',

                level: delogLevels.info,
                method: 'method-name',

                context: {
                    ...testContext,
                    sharedOrder: 0,
                },

                text: 'Test Start',
            });

            if (value < 0.5) {
                delog({
                    endpoint,
                    token,

                    project: 'one',
                    space: 'space-name',

                    level: delogLevels.error,
                    method: 'method-name',

                    context: {
                        ...testContext,
                        sharedOrder: 1,
                    },

                    text: 'Test End Branch A',
                });
            } else {
                delog({
                    endpoint,
                    token,

                    project: 'one',
                    space: 'space-name',

                    level: delogLevels.info,
                    method: 'method-name',

                    context: {
                        ...testContext,
                        sharedOrder: 1,
                    },

                    text: 'Test End Branch B',
                });
            }
        }


        outsideFunction(
            0.3,
        );

        outsideFunction(
            0.4,
            {
                mode: 'TESTING',
                suite: 'two',
                scenario: 'three',
                sharedID: 'one',
            },
        );

        outsideFunction(
            0.6,
            {
                mode: 'TESTING',
                suite: 'two',
                scenario: 'four',
                sharedID: 'two',
            },
        );
    });
});
// #endregion module
