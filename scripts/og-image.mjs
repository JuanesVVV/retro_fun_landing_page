import sharp from 'sharp';

const SRC = 'src/assets/images/hero/controller.webp';

const mando = await sharp(SRC).resize({ height: 460 }).png().toBuffer();

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: '#050d24' },
})
  .composite([{ input: mando, gravity: 'center' }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-image.jpg');

console.log('Listo: public/og-image.jpg');