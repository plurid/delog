// #region imports
    // #region libraries
    import merge from 'lodash.merge';
    // #endregion libraries


    // #region internal
    import owner from './owner/resolvers';
    import analytics from './analytics/resolvers';
    import code from './code/resolvers';
    import tokens from './tokens/resolvers';
    import projects from './projects/resolvers';
    import spaces from './spaces/resolvers';
    import providers from './providers/resolvers';
    import repositories from './repositories/resolvers';
    import formats from './formats/resolvers';
    import notifiers from './notifiers/resolvers';
    import testers from './testers/resolvers';
    import records from './records/resolvers';
    import tests from './tests/resolvers';
    import setup from './setup/resolvers';
    // #endregion internal
// #endregion imports



// #region module
const generateResolvers = (
    ...imports: any[]
) => {
    const resolvers = {};

    merge(
        resolvers,
        ...imports,
    );

    return resolvers;
}

const resolvers = generateResolvers(
    owner,
    analytics,
    code,
    tokens,
    projects,
    spaces,
    providers,
    repositories,
    formats,
    notifiers,
    testers,
    records,
    tests,
    setup,
);
// #endregion module



// #region exports
export default resolvers;
// #endregion exports
