import sharp from 'sharp';

const SRC = 'src/assets/images/hero/controller.webp';
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

await sharp(SRC)
  .resize(64, 64, { fit: 'contain', background: transparent })
  .png()
  .toFile('public/favicon.png');

await sharp(SRC)
  .resize(180, 180, { fit: 'contain', background: '#050d24' })
  .png()
  .toFile('public/apple-touch-icon.png');

console.log('Listo: favicon.png y apple-touch-icon.png');