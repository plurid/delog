const delog = require('@plurid/delog').default;

const {
    delogLevels,
}= require('@plurid/delog');



const main = () => {
    const endpoint = 'http://localhost:56965/delog';
    const token = '__TESTS__';

    delog({
        text: 'Delogged from main().',

        endpoint,
        token,

        project: 'delog',
        space: 'fixtures/delog-testers',

        level: delogLevels.info,
        method: 'repository',
        format: '%LEVEL %TIME %TEXT',

        context: {
            call: {
                codeProvider: 'github',
                repositoryName: '@plurid/delog',
                repositoryBasePath: '/',
            },
        },
    });
}

main();