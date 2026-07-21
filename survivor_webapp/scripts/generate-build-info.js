// Writes the current build timestamp to src/assets/build_fe.html.
// Runs automatically before every `ng build` via the npm `prebuild*` hooks in
// package.json, so the FE build date shown in the app is always tied to the
// actual build step instead of being maintained by hand in deploy scripts.
const fs = require('fs');
const path = require('path');

const formatted = new Date().toLocaleString('it-IT', {
  timeZone: 'Europe/Rome',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

const outPath = path.join(__dirname, '..', 'src', 'assets', 'build_fe.html');
fs.writeFileSync(outPath, formatted);
console.log(`Build FE timestamp written: ${formatted}`);
