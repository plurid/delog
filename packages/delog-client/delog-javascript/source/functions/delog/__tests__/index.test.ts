// #region imports
    // #region external
    import {
        DelogTestingContext,
    } from '#data/interfaces';

    import {
        delogLevels,
    } from '#data/constants';

    import delog from '..';
    // #endregion external
// #endregion imports



// #region module
const endpoint = 'http://localhost:56965/delog';
const token = '__TESTS__';


describe('delog - simple', () => {
    it.only('works', () => {
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
                    repository: {
                        provider: 'codeProvider-test',
                        name: 'one',
                        basePath: '',
                    },
                },
            },
        });
    });



    xit('works - stress test', async () => {
        jest.setTimeout(120_000);

        const few = 101;
        const small = 1_001;
        const medium = 10_001;
        // const large = 50_001; -- node/jest limitations
        // const huge = 1_000_001;

        for (let i = 0; i < few; i++) {
            const randomLevel = Math.floor(Math.random() * 6) + 1;

            delog({
                text: 'works ' + i,

                endpoint,
                token,

                project: 'project-name',
                space: 'space-name',

                level: randomLevel,
                method: 'method-name',
                format: '%LEVEL %TIME %TEXT',
                extradata: JSON.stringify({one: 'two'}),
            });
        }

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 120_000);
        });
    });



    xit('works - stress test timeout', async () => {
        jest.setTimeout(60000);

        for (let i = 0; i < 31; i++) {
            await new Promise((resolve, reject) => {
                setTimeout(async () => {
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

                    resolve();
                }, 100);
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
