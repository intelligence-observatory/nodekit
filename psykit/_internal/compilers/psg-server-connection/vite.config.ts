import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/main.ts',
            fileName: () => 'psg-server-connection.js',
            name: 'PsgServerConnection',
            formats: ['umd'], // Exports a global "NodePlayer" variable
        },
        outDir: 'dist',
        emptyOutDir: false,
    },
});