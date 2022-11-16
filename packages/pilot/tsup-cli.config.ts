import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/cli'],
	outDir: 'dist/cli',
	format: ['cjs'],
	bundle: false,
	clean: false,
	dts: false,
	minify: false,
	sourcemap: true
})
