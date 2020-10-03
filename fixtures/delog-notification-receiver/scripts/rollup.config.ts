// #region imports
    // #region libraries
    import json from '@rollup/plugin-json';
    import typescript from 'rollup-plugin-typescript2';
    import resolve from '@rollup/plugin-node-resolve';
    import commonjs from '@rollup/plugin-commonjs';
    // #endregion libraries
// #endregion imports



// #region module
const pkg = require('../package.json');


export default {
    input: './source/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
        },
    ],
    external: [
        'events',
        'util',
        'stream',
        'http',
        'path',
        'assert',
        'url',
        'net',
        'querystring',
        'tty',
        'fs',
        'zlib',
        'buffer',
        'os',
        'crypto',
        'string_decoder',
    ],
    watch: {
        include: 'source/**',
    },
    plugins: [
        json(),
        typescript({
            tsconfig: './tsconfig.json',
        }),
        resolve({
            preferBuiltins: true,
        }),
        commonjs(),
    ],
};
// #endregion module
