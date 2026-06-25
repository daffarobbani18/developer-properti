const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/screens/**/*.tsx');

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Add StatusBar to react-native import if not present
  if (content.includes("from \"react-native\";") && !content.includes("StatusBar")) {
    content = content.replace(
      /import \{([^}]+)\} from "react-native";/g, 
      (match, p1) => `import {${p1}, StatusBar } from "react-native";`
    );
    changed = true;
  } else if (content.includes("from 'react-native';") && !content.includes("StatusBar")) {
    content = content.replace(
      /import \{([^}]+)\} from 'react-native';/g, 
      (match, p1) => `import {${p1}, StatusBar } from 'react-native';`
    );
    changed = true;
  }

  // 2. Replace safeTop calculation
  const oldCalc = "const safeTop = Math.max(insets?.top || 0, Platform.OS === 'android' ? 40 : 20);";
  if (content.includes(oldCalc)) {
    content = content.replace(
      oldCalc,
      "const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);"
    );
    changed = true;
  }

  // Also replace the very old one just in case
  const oldCalc2 = "const safeTop = Math.max(insets.top, Platform.OS === 'android' ? 40 : 20);";
  if (content.includes(oldCalc2)) {
    content = content.replace(
      oldCalc2,
      "const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);"
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated StatusBar fix in ${file}`);
    changedCount++;
  }
}

console.log(`Done. Updated ${changedCount} files.`);
