import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx', 'src/index.native.tsx'],
	external: ['react', 'react-i18next', 'react-native'],
	format: ['esm', 'cjs'],
	bundle: false,
	clean: false,
	dts: true,
	sourcemap: true
});
