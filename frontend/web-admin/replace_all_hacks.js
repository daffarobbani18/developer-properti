const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(process.cwd(), 'src'));
let changedFiles = 0;

const replacement1 = `const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }`;

const replacement2 = `const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
        let token = "";
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          token = authData.token;
        }
        if (!token) return;`;

// Matches any email in the body for the login fetch
const regex1 = /const\s+loginRes\s*=\s*await\s+fetch\([\s\S]*?body:\s*JSON\.stringify\(\{\s*email:\s*["'][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}["'][\s\S]*?\}\)[\s\S]*?\}\);[\s\n]*const\s+loginData\s*=\s*await\s+loginRes\.json\(\);[\s\n]*const\s+token\s*=\s*loginData\.token;/g;
const regex2 = /const\s+loginRes\s*=\s*await\s+fetch\([\s\S]*?body:\s*JSON\.stringify\(\{\s*email:\s*["'][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}["'][\s\S]*?\}\)[\s\S]*?\}\);[\s\n]*const\s+loginData\s*=\s*await\s+loginRes\.json\(\);[\s\n]*if\s*\(!loginData\.token\)\s*return;/g;
const regex3 = /const\s+loginRes\s*=\s*await\s+fetch\([\s\S]*?["'][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}["'][\s\S]*?\}\);[\s\n]*const\s+loginData\s*=\s*await\s+loginRes\.json\(\);[\s\n]*if\s*\(!loginData\.token\)\s*return;/g;
const regex4 = /const\s+loginRes\s*=\s*await\s+fetch\([\s\S]*?["'][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}["'][\s\S]*?\}\);[\s\n]*const\s+loginData\s*=\s*await\s+loginRes\.json\(\);[\s\n]*const\s+token\s*=\s*loginData\.token;/g;
const regex5 = /const\s+loginRes\s*=\s*await\s+fetch\([\s\S]*?["'][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}["'][\s\S]*?\}\);[\s\n]*const\s+\{\s*token\s*\}\s*=\s*await\s+loginRes\.json\(\);/g;

files.forEach(file => {
  // EXCLUDE the actual login page!
  if (file.includes('login\\page.tsx') || file.includes('login/page.tsx')) {
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  if (content.match(regex1)) {
    content = content.replace(regex1, replacement1);
  }
  if (content.match(regex2)) {
    content = content.replace(regex2, replacement2);
  }
  if (content.match(regex3)) {
    content = content.replace(regex3, replacement2);
  }
  if (content.match(regex4)) {
    content = content.replace(regex4, replacement1);
  }
  if (content.match(regex5)) {
    content = content.replace(regex5, replacement1);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
    changedFiles++;
  }
});

console.log('Total files changed:', changedFiles);
