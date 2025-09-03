import {defineConfig} from 'vite';

export default defineConfig(
    {
        build: {
            lib: {
                entry: 'src/main.ts',
                fileName: (format) => format === 'es' ? 'nodekit.esm.js' : 'nodekit.js',
                name: 'NodeKit',
                formats: ['es', 'iife'],
            },
            outDir: 'dist',
            emptyOutDir: true,
        },
    }
);