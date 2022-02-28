import {builtinModules} from 'module';
import {dependencies} from './package.json';

export default {
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
		intro: 'exports = module.exports = fetch;'
	},
	external: [...builtinModules, ...Object.keys(dependencies)]
};
