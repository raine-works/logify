import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
	buildDir: '.build',
	modules: ['ui'],
	css: ['ui/output.css'],
	target: 'server',
})
