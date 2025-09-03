import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/main.ts',
            fileName: () => 'nodekit.js',
            name: 'EventClient',
            formats: ['umd'], // Exports a global "EventClient" variable
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
});