const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/screens', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace shadowColor: "#000" with shadowColor: c.neutral900
    content = content.replace(/shadowColor:\s*["']#000["']/g, 'shadowColor: c.neutral900');
    // Replace shadowOpacity: 0.03 with shadowOpacity: 0.04 to make it slightly more visible but soft
    content = content.replace(/shadowOpacity:\s*0\.03/g, 'shadowOpacity: 0.04');
    
    // Check if we need to import c
    if (content !== original) {
      if (!content.includes('import { c }') && !content.includes('import {c}')) {
        // Find the last import
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const endOfLastImport = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfLastImport + 1) + 'import { c } from "../../theme";\n' + content.slice(endOfLastImport + 1);
          // Wait, this might be wrong if it's in a deeply nested folder.
          // Let's just fix the import path depending on depth.
          const depth = filePath.split(path.sep).length - 3; // src/screens = 3 segments, so depth is length - 3
          let importPath = depth === 1 ? '"../theme"' : '"../../theme"';
          if (filePath.includes('customer') || filePath.includes('pengawas')) {
            importPath = '"../../theme"';
          } else {
             importPath = '"../theme"';
          }
          
          content = content.replace('import { c } from "../../theme";\n', `import { c } from ${importPath};\n`);
        }
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
