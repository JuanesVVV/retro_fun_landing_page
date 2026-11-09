import sharp from 'sharp';
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const IMG = 'src/assets/images';
const MAX_WIDTH = 1200;

function walk(dir) {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// 1) PNG/JPG → WebP (calidad 75, compresión máxima)
for (const file of walk(IMG)) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
  const out = file.slice(0, -ext.length) + '.webp';
  await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75, effort: 6 })
    .toFile(out);
  console.log('✔', basename(out));
}

// 2) Mando: hero (520 px) y pie de página (112 px = 2x de 56)
const controller = join(IMG, 'hero/controller.webp');
for (const [name, width] of [['controller-520.webp', 520], ['controller-sm.webp', 112]]) {
  await sharp(controller).resize({ width }).webp({ quality: 75, effort: 6 }).toFile(join(IMG, 'hero', name));
  console.log('✔', name);
}

// 3) Logo del header: se muestra a 36 px de alto → se guarda a 72 px (2x)
//    y se escriben sus medidas reales (width/height) en index.html
const logoSrc = ['logo-text.png', 'logo-text.jpeg', 'logo-text.jpg']
  .map(n => join(IMG, n)).find(existsSync);
if (logoSrc) {
  const logoOut = join(IMG, 'logo-text.webp');
  await sharp(logoSrc).resize({ height: 72 }).webp({ quality: 80, effort: 6 }).toFile(logoOut);
  const { width, height } = await sharp(logoOut).metadata();
  const w = Math.round(width / 2), h = height / 2;
  let html = readFileSync('index.html', 'utf8');
  html = html.replace(
    /(<img src="\/src\/assets\/images\/logo-text\.webp"[^>]*?)\s(?:width="\d+"\s)?height="\d+"/,
    `$1 width="${w}" height="${h}"`
  );
  writeFileSync('index.html', html);
  console.log(`✔ logo-text.webp (${w}x${h} en pantalla) y index.html actualizado`);
}
