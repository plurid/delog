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
        setup,
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
        .description('log into a delog server using the identonym and the key')
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
        .option(
            '-s, --server <server>',
            'server address',
        )
        .option(
            '-i, --identonym <identonym>',
            'identonym',
        )
        .description('log out of a delog server, default or specified')
        .action(async (options: any) => {
            await logout(
                options.server,
                options.identonym,
            );
        });


    program
        .command('setup')
        .requiredOption(
            '-s, --server <server>',
            'server address',
        )
        .requiredOption(
            '-i, --identonym <identonym>',
            'identonym',
        )
        .option(
            '-d, --default',
            'make the default delog server',
        )
        .description('setup the configuration for a delog server')
        .action(async (options: any) => {
            const data: any = {
                text: options.text,
            };

            await setup(data);
        });


    program
        .command('record')
        .option(
            '--server <server>',
            'server address',
        )
        .option(
            '--identonym <identonym>',
            'identonym',
        )
        .option(
            '-f, --format <format>',
            'format',
        )
        .option(
            '-p, --project <project>',
            'project',
        )
        .option(
            '-s, --space <space>',
            'space',
        )
        .option(
            '-l, --level <level>',
            'level',
        )
        .option(
            '-m, --method <method>',
            'method',
        )
        .option(
            '-i, --sharedID <sharedID>',
            'sharedID',
        )
        .option(
            '-o, --sharedOrder <sharedOrder>',
            'sharedOrder',
        )
        .option(
            '-e, --error <error>',
            'error',
        )
        .option(
            '-x, --extradata <extradata>',
            'extradata',
        )
        .option(
            '-c, --context <context>',
            'context',
        )
        .requiredOption(
            '-t, --text <text>',
            'text',
        )
        .description('record to the delog server, default or specified')
        .action(async (options: any) => {
            try {
                const {
                    server,
                    identonym,

                    format,

                    project,
                    space,

                    level,
                    method,
                    sharedID,
                    sharedOrder,
                    error,
                    extradata,
                    context,
                    text,
                } = options;

                const data: any = {
                    format,

                    project,
                    space,

                    level: parseInt(level),
                    method,
                    sharedID,
                    sharedOrder: parseInt(sharedOrder),
                    error,
                    extradata,

                    context: JSON.parse(context),

                    text,
                };

                await record(
                    data,
                    server,
                    identonym,
                );
            } catch (error) {
                console.log('Could not record to delog. Something went wrong.');
                return;
            }
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
