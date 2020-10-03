// #region imports
    // #region libraries
    import program, {
        CommanderStatic,
    } from 'commander';
    // #endregion libraries


    // #region external
    import {
        status,
        login,
        logout,
        record,
    } from '../commands';
    // #endregion external
// #endregion imports



// #region module
const main = async (
    program: CommanderStatic,
) => {
    program
        .storeOptionsAsProperties(false)
        .passCommandToAction(false);

    program
        .name('delog')
        .usage('<command>')
        .version('0.0.0', '-v, --version')
        .action(() => {
            program.outputHelp();
        });


    program
        .command('status')
        .description('show the connection status')
        .action(async () => {
            await status();
        });

    program
        .command('login')
        .description('login into a delog server using the identonym and the key')
        .requiredOption(
            '-s, --server <server>',
            'server address',
        )
        .requiredOption(
            '-i, --identonym <identonym>',
            'identonym',
        )
        .requiredOption(
            '-k, --key <key>',
            'key',
        )
        .action(async (options: any) => {
            await login(
                options.server,
                options.identonym,
                options.key,
            );
        });

    program
        .command('logout')
        .description('log out of the delog server')
        .action(async () => {
            await logout();
        });

    program
        .command('record')
        .requiredOption(
            '-t, --text <text>',
            'text',
        )
        .description('record to the delog server')
        .action(async (options: any) => {
            const data: any = {
                text: options.text,
            };

            await record(data);
        });


    program.parseAsync(process.argv);
}


const cli = () => {
    main(program);
}
// #endregion module



// #region exports
export default cli;
// #endregion exports
