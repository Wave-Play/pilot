import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src'],
	format: ['cjs'],
	bundle: false,
	clean: true,
	dts: false,
	minify: false,
	sourcemap: true
})
