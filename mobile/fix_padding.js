const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/screens/pengawas/*.tsx');

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes("paddingBottom: 60,")) {
    content = content.replace(/heroHeader:\s*\{\s*paddingBottom:\s*60,/g, "heroHeader: {\n    paddingBottom: 120,");
    changed = true;
  }
  
  if (content.includes("paddingBottom: 40,")) {
    content = content.replace(/heroHeader:\s*\{\s*paddingBottom:\s*40,/g, "heroHeader: {\n    paddingBottom: 120,");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated padding in ${file}`);
    changedCount++;
  }
}

console.log(`Done. Updated ${changedCount} files.`);
