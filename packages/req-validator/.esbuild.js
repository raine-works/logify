const { build } = require('esbuild')
const { dependencies } = require('./package.json')
const { Generator } = require('npm-dts')

const shared = {
    entryPoints: ['src/index.ts'], 
    bundle: true, 
    external: Object.keys(dependencies), 
    platform: 'node'
}

build({
    ...shared, 
    outfile: '.build/index.js'
})

build({
    ...shared, 
    outfile: '.build/index.esm.js', 
    format: 'esm'
})

new Generator({
    entry: 'src/index.ts', 
    output: '.build/index.d.ts'
}).generate()