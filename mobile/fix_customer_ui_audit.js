const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/screens/customer/*.tsx');

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Fix heroHeader paddingBottom to 60 and minHeight 240
  if (content.includes("paddingBottom: 120,")) {
    content = content.replace(/heroHeader:\s*\{\s*paddingBottom:\s*120,/g, "heroHeader: {\n    minHeight: 240,\n    paddingBottom: 60,");
    changed = true;
  }

  // 2. Fix paddingTop: safeTop to safeTop + 16
  if (content.includes("{ paddingTop: safeTop }")) {
    content = content.replace(/\{\s*paddingTop:\s*safeTop\s*\}/g, "{ paddingTop: safeTop + 16 }");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Audited and fixed UI in ${file}`);
    changedCount++;
  }
}

console.log(`Done. Updated ${changedCount} files.`);
