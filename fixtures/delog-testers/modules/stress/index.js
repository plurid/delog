const delog = require('@plurid/delog').default;

const {
    delogLevels,
}= require('@plurid/delog');



const main = () => {
    const endpoint = 'http://localhost:56965/delog';
    const token = '__TESTS__';

    const small = 1_001;
    const medium = 10_001;
    const large = 20_001;

    for (let i = 0; i < large; i++) {
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
}

main();
