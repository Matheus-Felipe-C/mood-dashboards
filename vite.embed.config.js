import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import { readFile, readFileSync, write, writeFile, writeFileSync } from 'fs';

export default defineConfig({
    plugins: [
        react(),
        {
            // After the build, wrap the output in a full HTML document
            // and write it as a JS module that exports the HTML string.
            closeBundle() {
                const js = readFileSync('dist-embed/assets/index.js', 'utf-8');
                const css = readFileSync('dist-embed/assets/index.css', 'utf-8');

                const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${css}</style>
</head>
<body>
  <div id="root"></div>
  <script>${js}<\/script>
</body>
</html>`;

                /**
                 * Export as a getter function — keeps the string inlined at the call site
                 * after bundling, avoiding a separate top-level variable that the
                 * Amplenote Plugin Builder would strip out.
                 */
                writeFileSync(
                    'src/mood-embed.js',
                    `export default function getHTML() { return ${JSON.stringify(html)}; }\n`
                );
                writeFileSync('src/mood-embed.d.ts', `declare function getHTML(): string;\nexport default getHTML;\n`);

                console.log('mood-embed.js written!');
            }
        }
    ],
    build: {
        outDir: 'dist-embed',
        rolldownOptions: {
            input: 'src/main.tsx',
            output: {
                format: 'iife',
                name: 'EmbedApp',
                codeSplitting: true,
                entryFileNames: "assets/index.js",
                assetFileNames: "assets/index.css",
            }
        }
    }
})