// subfolder

const delog = require('@plurid/delog').default;

const {
    delogLevels,
}= require('@plurid/delog');



const subfolder = () => {
    const endpoint = 'http://localhost:56965/delog';
    const token = '__TESTS__';

    delog({
        text: 'Delogged from subfolder().',

        endpoint,
        token,

        project: 'delog',
        space: 'fixtures/delog-testers',

        level: delogLevels.info,
        method: 'repository',
        format: '%LEVEL %TIME %TEXT',

        context: {
            call: {
                repository: {
                    provider: 'github',
                    name: 'plurid/delog',
                    branch: 'master',
                    commit: 'latest',
                },
            },
        },
    });
}

subfolder();
