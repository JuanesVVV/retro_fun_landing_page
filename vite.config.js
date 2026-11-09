import { defineConfig } from 'vite';

function inlineCssAndPreloadFont() {
  let base = '/';
  return {
    name: 'inline-css-preload-font',
    apply: 'build',
    enforce: 'post',
    configResolved(cfg) { base = cfg.base; },
    generateBundle(_, bundle) {
      const htmlFile = bundle['index.html'];
      if (!htmlFile) return;
      let html = String(htmlFile.source);

      for (const [name, file] of Object.entries(bundle)) {
        if (!name.endsWith('.css')) continue;
        const link = new RegExp(`<link[^>]*rel="stylesheet"[^>]*href="[^"]*${name.split('/').pop()}"[^>]*>`);
        if (link.test(html)) {
          html = html.replace(link, () => `<style>${String(file.source)}</style>`);
          delete bundle[name];
        }
      }

      const font = Object.keys(bundle).find(n => /pixelify-sans-latin-700-normal.*\.woff2$/.test(n));
      if (font) {
        html = html.replace(
          '<head>',
          `<head>\n  <link rel="preload" as="font" type="font/woff2" href="${base}${font}" crossorigin />`
        );
      }
      htmlFile.source = html;
    },
  };
}

export default defineConfig({
  base: '/retro_fun_landing_page/',
  plugins: [inlineCssAndPreloadFont()],
  build: { target: 'es2020' },
});