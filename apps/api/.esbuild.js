require('esbuild').buildSync({
	entryPoints: ['src/index.ts'],
	platform: 'node',
	bundle: true,
	minify: true,
	sourcemap: true,
	outdir: '.build'
})