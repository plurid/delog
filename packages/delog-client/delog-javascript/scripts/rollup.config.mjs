// #region imports
    // #region libraries
    import typescript from 'rollup-plugin-typescript2';
    import terser from '@rollup/plugin-terser';
    // #endregion libraries


    // #region external
    import pkg from '../package.json' assert { type: 'json' };
    // #endregion external
// #endregion imports



// #region module
export default {
    input: './source/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
        },
    ],
    external: [
        '@apollo/client',
        '@apollo/client/core',
        '@plurid/plurid-functions',
        'cross-fetch',
        'graphql',
        'graphql-tag',
        'microtime',
        'subscriptions-transport-ws',
    ],
    watch: {
        include: 'source/**',
    },
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
        }),
        terser({
            mangle: false,
            compress: false,
            format: {
                beautify: true,
                comments: false,
            },
        }),
    ],
};
// #endregion module
