const {
    execSync,
} = require('child_process');



const commands = {
    'simple-test': 'record -t test',
};


const main = (
    name,
) => {
    const binder = 'node ./binder/delog';
    const delog = commands[name];

    const command = binder + ' ' + delog;

    execSync(command, {
        cwd: process.cwd(),
        stdio: 'inherit',
    });
}


main(
    'simple-test',
);
