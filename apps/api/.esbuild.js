const { dependencies } = require('./package.json')
require('esbuild').buildSync({
	entryPoints: ['src/index.ts'],
	external: Object.keys(dependencies), 
	platform: 'node',
	bundle: true,
	minify: true,
	sourcemap: true,
	outdir: '.build'
})