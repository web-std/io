import {builtinModules} from 'module';
import {dependencies} from './package.json';

export default [
	{
		input: 'src/lib.js',
		output: {
			file: 'dist/lib.cjs',
			format: 'cjs',
			esModule: false,
			interop: false,
			sourcemap: true,
			preferConst: true,
			exports: 'named',
			// https://github.com/rollup/rollup/issues/1961#issuecomment-534977678
			outro: 'exports = module.exports = Object.assign(fetch, exports);'
		},
		external: [...builtinModules, ...Object.keys(dependencies)]
	},
	{
		input: 'src/lib.node.js',
		output: {
			file: 'dist/lib.node.cjs',
			format: 'cjs',
			esModule: false,
			interop: false,
			sourcemap: true,
			preferConst: true,
			exports: 'named',
			// https://github.com/rollup/rollup/issues/1961#issuecomment-534977678
			outro: 'exports = module.exports = Object.assign(fetch, exports);'
		},
		external: [...builtinModules, ...Object.keys(dependencies)]
	},
];
