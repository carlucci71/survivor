const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
let pngToIco = require('png-to-ico');
if (pngToIco && pngToIco.default) pngToIco = pngToIco.default;

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const tmpDir = path.join(assetsDir, '.tmp-fav');
const svgFile = path.join(assetsDir, 'bravehart.svg');
const outIco = path.join(assetsDir, 'favicon.ico');

async function ensureTmp() {
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
}

async function generate() {
  await ensureTmp();
  const sizes = [16, 32, 48, 64, 128];
  const pngPaths = [];
  for (const s of sizes) {
    const out = path.join(tmpDir, `bravehart-${s}.png`);
    pngPaths.push(out);
    await sharp(svgFile)
      .resize(s, s, { fit: 'contain' })
      .png()
      .toFile(out);
  }
  const ico = await pngToIco(pngPaths);
  fs.writeFileSync(outIco, ico);
  // clean tmp
  for (const p of pngPaths) {
    try { fs.unlinkSync(p); } catch (e) {}
  }
  try { fs.rmdirSync(tmpDir); } catch (e) {}
  console.log('Generated', outIco);
}

generate().catch(err => { console.error(err); process.exit(1); });
