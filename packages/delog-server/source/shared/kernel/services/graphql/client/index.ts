// #region imports
    // #region libraries
    import fetch from 'cross-fetch';

    import {
        ApolloClient,
        createHttpLink,
        InMemoryCache,
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
const DEFAULT_GRAPHQL_ENDPOINT = '/delog';

const graphqlEndpoint = () => {
    if (typeof window === 'undefined') {
        return DEFAULT_GRAPHQL_ENDPOINT;
    }

    if ((window as any).DELOG_GRAPHQL_ENDPOINT) {
        return (window as any).DELOG_GRAPHQL_ENDPOINT;
    }

    return DEFAULT_GRAPHQL_ENDPOINT;
}


const client = new ApolloClient({
    link: createHttpLink({
        uri: graphqlEndpoint(),
        credentials: 'include',
        /**
         * HACK: types mismatch
         */
        fetch: fetch as any,
    }),
    cache: new InMemoryCache(),
});
// #endregion module



// #region exports
export default client;
// #endregion exports
