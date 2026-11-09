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

for (const file of walk('src/assets/images')) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
  const out = file.replace(ext, '.webp');
  await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  console.log('✔', basename(out));
}