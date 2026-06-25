const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/screens/**/*.tsx');

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes("{ paddingTop: safeTop + 16 }")) {
    content = content.replace(/\{\s*paddingTop:\s*safeTop\s*\+\s*16\s*\}/g, "{ paddingTop: (safeTop || 45) + 16 }");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed TypeScript error in ${file}`);
    changedCount++;
  }
}

console.log(`Done. Updated ${changedCount} files.`);
