import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
	buildDir: '.build',
	modules: ['ui', '@pinia/nuxt'],
	autoImports: {
		dirs: ['defineStore'],
	},
	css: ['ui/output.css'],
	target: 'server',
})
