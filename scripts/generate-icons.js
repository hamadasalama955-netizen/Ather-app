import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('./public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile('./public/pwa-192x192.png');
  console.log('pwa-192x192.png generated');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile('./public/pwa-512x512.png');
  console.log('pwa-512x512.png generated');

  // Apple touch icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile('./public/apple-touch-icon.png');
  console.log('apple-touch-icon.png generated');

  // Maskable 512x512 with safe-zone margin (inner scaled by ~82% centered on luxury cream canvas)
  const innerResized = await sharp(svgBuffer)
    .resize(420, 420)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 250, g: 247, b: 238, alpha: 1 } // #FAF7EE
    }
  })
    .composite([{ input: innerResized, top: 46, left: 46 }])
    .png({ quality: 100 })
    .toFile('./public/pwa-maskable-512x512.png');
  console.log('pwa-maskable-512x512.png generated');

  // Favicon 48x48 PNG
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile('./public/favicon.ico');
  console.log('favicon.ico generated');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
