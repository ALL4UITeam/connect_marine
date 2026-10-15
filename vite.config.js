import { readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { site, pages } from './src/data/site.js';
import { marineContext } from './src/data/marine.js';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const sourceRoot = resolve(projectRoot, 'src');

function findPages(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return findPages(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

export default defineConfig({
  root: sourceRoot,
  base: './',
  publicDir: resolve(projectRoot, 'public'),
  appType: 'mpa',
  plugins: [
    handlebars({
      helpers: {
        choose: (condition, yes, no) => (condition ? yes : no),
        and: (...args) => args.slice(0, -1).every(Boolean),
        not: (value) => !value,
      },
      partialDirectory: resolve(sourceRoot, 'partials'),
      context(pagePath) {
        const key = pagePath.replaceAll('\\', '/');
        const page = pages[key] ?? { title: site.name, description: site.description };
        const directory = dirname(key);
        const rootPath = relative(directory, '/').replaceAll('\\', '/') || '.';
        return {
          ...marineContext,
          site,
          page,
          rootPath,
          year: new Date().getFullYear(),
          navigation: site.navigation.map((item) => ({
            ...item,
            href: `${rootPath}${item.path}`,
            active: item.path === key,
          })),
        };
      },
    }),
  ],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: true,
    rolldownOptions: { input: findPages(sourceRoot) },
  },
});
