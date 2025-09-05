import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts'; // Used for generating TypeScript declaration files (.d.ts)

export default defineConfig(
    {
        build: {
            lib: {
                entry: 'src/main.ts',
                fileName: (format) => format === 'es' ? 'nodekit.esm.js' : 'nodekit.js',
                cssFileName: 'nodekit',
                name: 'NodeKit',
                formats: [
                    'es',
                    'iife'
                ],
            },
            outDir: 'dist',
            emptyOutDir: true,
            minify: true,
        },
        plugins: [
            dts( // For generating TypeScript declaration file (.d.ts)
                {
                    tsconfigPath: './tsconfig.json',
                    rollupTypes: true,
                }
            )
        ]

    }
);