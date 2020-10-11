const {
    execSync,
} = require('child_process');



const main = () => {
    const command = 'node ./binder/delog record -t test';

    execSync(command, {
        cwd: process.cwd(),
        stdio: 'inherit',
    });
}


main();
