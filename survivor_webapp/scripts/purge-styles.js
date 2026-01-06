const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const dist = path.join(__dirname, '..', 'dist', 'survivor_webapp');
    const cssFile = path.join(dist, 'browser', 'styles.css');
    const outFile = path.join(dist, 'browser', 'styles.purged.css');
    if (!fs.existsSync(cssFile)) {
      console.error('CSS file not found:', cssFile);
      process.exit(2);
    }

    const purgeCSSResults = await new PurgeCSS().purge({
      content: [
        path.join(dist, '**', '*.js'),
        path.join(dist, 'index.html')
      ],
      css: [cssFile],
      safelist: [
        /^mat-/, /^cdk-/, /^_ng/, /^ng-/, 'config-user', 'calcola-icon'
      ]
    });

    if (!purgeCSSResults || !purgeCSSResults.length) {
      console.error('PurgeCSS returned no results');
      process.exit(3);
    }

    const result = purgeCSSResults[0];
    fs.writeFileSync(outFile, result.css, 'utf8');

    const origSize = fs.statSync(cssFile).size;
    const newSize = fs.statSync(outFile).size;
    console.log('Wrote', outFile);
    console.log('Original size:', origSize, 'bytes');
    console.log('Purged size:  ', newSize, 'bytes');
    console.log('Saved:        ', (origSize - newSize), 'bytes');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
