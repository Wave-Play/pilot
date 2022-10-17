import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src', '!src/_generated.ts', '!src/cli.ts'],
	external: ['react', 'react-native'],
	format: ['esm', 'cjs'],
	bundle: false,
	clean: false,
	dts: true,
	minify: true,
	sourcemap: true
});