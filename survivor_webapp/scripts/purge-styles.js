const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const dist = path.join(__dirname, '..', 'dist', 'survivor_webapp');
    const browserDir = path.join(dist, 'browser');
    if (!fs.existsSync(browserDir)) {
      console.error('Browser directory not found:', browserDir);
      process.exit(2);
    }

    const files = fs.readdirSync(browserDir).filter((f) => f.endsWith('.css') && !f.endsWith('.purged.css'));
    if (!files.length) {
      console.error('No CSS files found in', browserDir);
      process.exit(2);
    }

    for (const f of files) {
      const cssFilePath = path.join(browserDir, f);
      console.log('Processing', cssFilePath);
      const purgeCSSResults = await new PurgeCSS().purge({
        content: [
          path.join(dist, 'browser', '**', '*.js'),
          path.join(dist, 'browser', 'index.html')
        ],
        css: [cssFilePath],
        safelist: [
          /^mat-/, /^cdk-/, /^_ng/, /^ng-/, 'config-user', 'calcola-icon'
        ]
      });

      if (!purgeCSSResults || !purgeCSSResults.length) {
        console.warn('PurgeCSS returned no results for', cssFilePath);
        continue;
      }

      const result = purgeCSSResults[0];
      const outFilePath = path.join(browserDir, f.replace(/\.css$/, '.purged.css'));
      fs.writeFileSync(outFilePath, result.css, 'utf8');

      const origSize = fs.statSync(cssFilePath).size;
      const newSize = fs.statSync(outFilePath).size;
      console.log('Wrote', outFilePath);
      console.log('  Original size:', origSize, 'bytes');
      console.log('  Purged size:  ', newSize, 'bytes');
      console.log('  Saved:        ', (origSize - newSize), 'bytes');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
