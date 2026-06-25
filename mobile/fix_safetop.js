const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/screens/**/*.tsx');

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("const safeTop = Math.max(insets.top, Platform.OS === 'android' ? 40 : 20);")) {
    content = content.replace(
      "const safeTop = Math.max(insets.top, Platform.OS === 'android' ? 40 : 20);",
      "const safeTop = Math.max(insets?.top || 0, Platform.OS === 'android' ? 40 : 20);"
    );
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
    changedCount++;
  }
}

console.log(`Done. Updated ${changedCount} files.`);
