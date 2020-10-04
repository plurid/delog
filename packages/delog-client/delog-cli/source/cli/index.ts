// #region imports
    // #region libraries
    import program, {
        CommanderStatic,
    } from 'commander';
    // #endregion libraries


    // #region external
    import {
        logLevels,
    } from '../data/constants';

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
        .option(
            '-s, --server <server>',
            'server address',
        )
        .option(
            '-i, --identonym <identonym>',
            'identonym',
        )
        .option(
            '-d, --default <default>',
            'make the default delog server',
        )
        .option(
            '-f, --format <format>',
            'set the delog format for the server',
        )
        .description('setup the configuration for a delog server')
        .action(async (options: any) => {
            const {
                server,
                identonym,
                format,
            } = options;

            const data: any = {
                default: options.default === 'true',
                format,
            };

            await setup(
                data,
                server,
                identonym,
            );
        });


    program
        .command('record')
        .requiredOption(
            '-t, --text <text>',
            'text',
        )
        .option(
            '--server <server>',
            'server address',
        )
        .option(
            '--identonym <identonym>',
            'identonym',
        )
        .option(
            '-l, --level <level>',
            'level',
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
            '-f, --format <format>',
            'format',
        )
        .option(
            '-m, --method <method>',
            'method',
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
        .description('record to the delog server, default or specified')
        .action(async (options: any) => {
            try {
                const {
                    server,
                    identonym,

                    text,
                    level,

                    project,
                    space,

                    format,

                    method,
                    error,
                    extradata,
                    context,
                } = options;

                const contextValue = context
                    ? {
                        ...JSON.parse(context),
                    } : {};

                const levelValue = parseInt(level)
                    ? parseInt(level)
                    : logLevels[level];

                const data: any = {
                    text,
                    level: levelValue,

                    project,
                    space,

                    format,

                    method,
                    error,
                    extradata,
                    context: contextValue,
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
