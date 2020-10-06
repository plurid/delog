const delog = require('@plurid/delog').default;
const {
    delogLevels,
}= require('@plurid/delog');



const anotherFunction = () => {
    const endpoint = 'http://localhost:56965/delog';
    const token = '__TESTS__';

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
}


const someFunction = () => {
    anotherFunction();
}


module.exports = {
    anotherFunction,
    someFunction,
};
