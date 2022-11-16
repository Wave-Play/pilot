import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/_generated', 'src/_generated-pages.ts'],
	format: ['cjs'],
	bundle: false,
	clean: false,
	dts: true,
	minify: true,
	sourcemap: true
})
