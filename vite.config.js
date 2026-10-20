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

function toClassicScript(code) {
  const imported = [];
  const withoutImports = code.replace(
    /^import\s*\{([^}]+)\}\s*from\s*["'][^"']+["'];?\r?\n/gm,
    (_, names) => {
      imported.push(names.trim());
      return '';
    },
  );
  const withoutExports = withoutImports.replace(/\n?export\s*\{([^}]+)\};?\s*$/m, (_, names) => {
    const bindings = names.split(',').map((name) =>
      name
        .trim()
        .split(/\s+as\s+/)
        .pop(),
    );
    return `\n${bindings.map((name) => `globalThis.${name} = ${name};`).join('\n')}\n`;
  });
  const header = imported.map((names) => `const { ${names} } = globalThis;\n`).join('');
  return `(() => {\n${header}${withoutExports}})();\n`;
}

function distFilePreview() {
  return {
    name: 'dist-file-preview',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type === 'chunk') item.code = toClassicScript(item.code);
        if (item.type === 'asset' && item.fileName.endsWith('.html')) {
          item.source = String(item.source)
            .replaceAll('<script type="module" crossorigin ', '<script defer ')
            .replaceAll(' crossorigin', '');
        }
      }
    },
  };
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
        };
      },
    }),
    distFilePreview(),
  ],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
    modulePreload: { polyfill: false },
    rolldownOptions: {
      input: findPages(sourceRoot),
      output: {
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
        minifyInternalExports: false,
        assetFileNames(assetInfo) {
          const name = assetInfo.names[0] ?? '';
          // 여러 HTML이 같은 SCSS를 쓰면 CSS가 공통 JS 청크(map-toolbar) 이름으로 나온다.
          if (name === 'map-toolbar.css') return 'assets/css/marine[extname]';
          if (name.endsWith('.css')) return 'assets/css/[name][extname]';
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
