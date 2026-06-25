const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'node_modules', 'react-native-image-viewing', 'dist', 'components', 'ImageItem');

if (fs.existsSync(targetDir)) {
  const androidJs = path.join(targetDir, 'ImageItem.android.js');
  const webJs = path.join(targetDir, 'ImageItem.web.js');
  
  const androidDts = path.join(targetDir, 'ImageItem.android.d.ts');
  const webDts = path.join(targetDir, 'ImageItem.web.d.ts');
  
  if (fs.existsSync(androidJs) && !fs.existsSync(webJs)) {
    fs.copyFileSync(androidJs, webJs);
    console.log('Copied ImageItem.android.js to ImageItem.web.js');
  }
  
  if (fs.existsSync(androidDts) && !fs.existsSync(webDts)) {
    fs.copyFileSync(androidDts, webDts);
    console.log('Copied ImageItem.android.d.ts to ImageItem.web.d.ts');
  }
} else {
  console.log('react-native-image-viewing not found in node_modules, skipping fix.');
}
