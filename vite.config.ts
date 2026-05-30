import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // Rollup always outputs `var <name> = (() => { ... })();` for IIFE.
      // This plugin strips that wrapper and replaces it with a plain arrow IIFE.
      name: 'strip-iife-assignment',
      generateBundle(_options, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'chunk') {
            // Remove `var plugin =` from the front and trailing `;`
            chunk.code = chunk.code
              .replace(/^var \w+ = /, "")
              .replace(/;$/, "");
          }
        }
      }
    }
  ],
})
