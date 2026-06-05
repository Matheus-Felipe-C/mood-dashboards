import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import { existsSync, readFile, readFileSync, write, writeFile, writeFileSync } from 'fs';

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'embed-html-wrapper',
            closeBundle() {
                const jsPath = 'dist-embed/assets/index.js';
                const cssPath = 'dist-embed/assets/index.css';

                const js = readFileSync(jsPath, 'utf-8');

                const css = existsSync(cssPath) ? readFileSync(cssPath) : '';

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
        cssCodeSplit: false,
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