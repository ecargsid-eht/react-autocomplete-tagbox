const packageJson = require('./package.json');
import peerDepsExternalPlugin from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        external: ['react', 'react-dom'],
        plugins: [
            peerDepsExternalPlugin(),
            nodeResolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json'
            }),
            terser(),
            postcss({
                modules: true,
                extensions: ['.css'],
            })
        ]
    },
    {
        input:"src/index.ts",
        output: [{file: packageJson.types}],
        plugins: [
            dts.default()
        ],
        external: [/\.css$/]
    }
]