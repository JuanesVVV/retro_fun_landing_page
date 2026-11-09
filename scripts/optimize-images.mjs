import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const MAX_WIDTH = 1200;

function walk(dir) {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// 1) Convierte PNG/JPG a WebP
for (const file of walk('src/assets/images')) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
  const out = file.slice(0, -ext.length) + '.webp';
  await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  console.log('✔', basename(out));
}

// 2) Variantes del mando: hero (520 px) y pie de página (112 px = 2x de 56)
const src = 'src/assets/images/hero/controller.webp';
const variants = [
  ['src/assets/images/hero/controller-520.webp', 520],
  ['src/assets/images/hero/controller-sm.webp', 112],
];
for (const [out, width] of variants) {
  await sharp(src).resize({ width }).webp({ quality: 80 }).toFile(out);
  console.log('✔', basename(out));
}