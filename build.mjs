import esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/plugin.ts'],
    bundle: true,
    format: 'iife',
    outfile: 'dist/plugin.js',
})