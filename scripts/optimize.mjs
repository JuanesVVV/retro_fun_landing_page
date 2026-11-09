import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const hero = 'src/assets/images/hero';
const imgs = 'src/assets/images';

// Leemos el mando en memoria para poder reescribir controller.webp sin conflicto
const mando = readFileSync(`${hero}/controller.webp`);

const jobs = [
  // [entrada, salida, resize, calidad]
  [mando, `${hero}/controller.webp`,     { width: 1000 },               75],
  [mando, `${hero}/controller-520.webp`, { width: 520 },                75],
  [mando, `${hero}/controller-sm.webp`,  { width: 112, height: 112, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }, 80],
  [`${imgs}/logo-text.png`, `${imgs}/logo-text.webp`, { height: 72 }, 80],
];

for (const [input, out, size, quality] of jobs) {
  const info = await sharp(input).resize(size).webp({ quality }).toFile(out);
  console.log(out.split('/').pop().padEnd(22), `${info.width}x${info.height}`, `${(info.size / 1024).toFixed(0)} KB`);
}