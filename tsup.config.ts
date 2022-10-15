import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src'],
	external: ['react', 'react-native'],
	format: ['esm', 'cjs'],
	bundle: false,
	clean: false,
	dts: true,
	minify: true,
	sourcemap: true
});
