const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/screens/**/*.tsx');

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix double commas
  if (content.includes(",, StatusBar")) {
    content = content.replace(/,, StatusBar/g, ", StatusBar");
    changed = true;
  }
  
  if (content.includes(",\n, StatusBar")) {
    content = content.replace(/,\n, StatusBar/g, ",\nStatusBar");
    changed = true;
  }
  
  if (content.includes(",\r\n, StatusBar")) {
    content = content.replace(/,\r\n, StatusBar/g, ",\r\nStatusBar");
    changed = true;
  }

  // Handle generic trailing comma before StatusBar
  content = content.replace(/,\s*, StatusBar/g, ",\n  StatusBar");
  
  // Actually a simpler regex for View,\n, StatusBar
  content = content.replace(/,\s*,\s*StatusBar/g, ",\n  StatusBar");

  // Let's just fix the files manually using regex if it's broken
  if (content !== fs.readFileSync(file, 'utf8')) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated comma fix in ${file}`);
      changedCount++;
  }
}

console.log(`Done. Updated ${changedCount} files.`);
