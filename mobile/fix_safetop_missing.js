const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/screens/**/*.tsx');

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes("paddingTop: safeTop,")) {
    content = content.replace(/paddingTop:\s*safeTop,/g, "paddingTop: (safeTop || 45) + 16,");
    changed = true;
  }
  
  if (content.includes("paddingTop: safeTop }")) {
    content = content.replace(/paddingTop:\s*safeTop\s*\}/g, "paddingTop: (safeTop || 45) + 16 }");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed missing safeTop in ${file}`);
    changedCount++;
  }
}

console.log(`Done. Updated ${changedCount} files.`);
