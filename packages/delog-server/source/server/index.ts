// #region imports
    // #region libraries
    import PluridServer, {
        PluridServerMiddleware,
        PluridServerService,
        PluridServerPartialOptions,
        PluridServerTemplateConfiguration,
    } from '@plurid/plurid-react-server';

    import {
        ApolloProvider,
    } from '@apollo/client';

    import {
        Provider as ReduxProvider,
    } from 'react-redux';
    // #endregion libraries


    // #region external
    import helmet from '~kernel-services/helmet';

    import reduxStore from '~kernel-services/state/store';
    import reduxContext from '~kernel-services/state/context';
    import apolloClient from '~kernel-services/graphql/client';

    import {
        shell,
        routes,
    } from '../shared';
    // #endregion external


    // #region internal
    import preserves from './preserves';

    import setupHandlers from './handlers';

    import {
        DelogLogic,
    } from './data/interfaces';

    import {
        GRAPHQL_ENDPOINT,
    } from './data/constants/graphql';

    // import mockLogic from './logic/mock';
    // #endregion internal
// #endregion imports



// #region module
/** ENVIRONMENT */
const watchMode = process.env.PLURID_WATCH_MODE === 'true';
const isProduction = process.env.ENV_MODE === 'production';
const buildDirectory = __dirname;
const port = process.env.PORT || 56965;
const hostname = process.env.DELOG_HOSTNAME || `localhost:${port}`;



/** CONSTANTS */
const applicationRoot = 'delog-application';
const openAtStart = watchMode
    ? false
    : isProduction
        ? false
        : true;

const quiet = false;
const debug = isProduction
    ? 'info'
    : 'error';

const usePTTP = false;




/** Custom styles to be loaded into the template. */
const styles: string[] = [
    //
];


/** Express-like middleware. */
const middleware: PluridServerMiddleware[] = [
    //
];


/** Services to be used in the application. */
const services: PluridServerService[] = [
    {
        name: 'Apollo',
        Provider: ApolloProvider,
        properties: {
            client: apolloClient,
        },
    },
    {
        name: 'Redux',
        Provider: ReduxProvider,
        properties: {
            store: reduxStore({}),
            context: reduxContext,
        },
    },
];


const options: PluridServerPartialOptions = {
    buildDirectory,
    open: openAtStart,
    quiet,
    debug,
    serverName: 'Delog Server',
    hostname,
    ignore: [
        GRAPHQL_ENDPOINT !== '/' ? GRAPHQL_ENDPOINT : '',
    ],
};

const template: PluridServerTemplateConfiguration = {
    root: applicationRoot,
    headScripts: [
        `
            <script>
                window.DELOG_GRAPHQL_ENDPOINT = "${GRAPHQL_ENDPOINT}";
            </script>
        `,
    ],
};



/** SERVER */
// generate server
const delogServer = new PluridServer({
    helmet,
    shell,
    routes,
    preserves,
    styles,
    middleware,
    services,
    options,
    template,
    usePTTP,
});



const delogSetup = (
    logic?: DelogLogic,
) => {
    setupHandlers(
        delogServer,
        logic,
    );
}



/**
 * If the file is called directly, as in `node build/index.js`,
 * it will run the server.
 *
 * The check is in place so that the server can also be imported
 * for programmatic usage.
 */
if (require.main === module) {
    delogSetup(
        // mockLogic,
    );

    delogServer.start(port);
}
// #endregion module



// #region exports
export * from './data/interfaces';

export {
    delogSetup,
};

export default delogServer;
// #endregion exports
