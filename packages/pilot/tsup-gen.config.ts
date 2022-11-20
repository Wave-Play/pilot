import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/_generated'],
	outDir: 'dist/_generated',
	format: ['cjs'],
	bundle: false,
	clean: false,
	dts: true,
	minify: true,
	sourcemap: true
})
