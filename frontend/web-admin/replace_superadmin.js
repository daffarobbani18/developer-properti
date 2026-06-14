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

// To handle: const loginRes = await fetch("http://localhost:4000/api/auth/login", { ... email: "superadmin@erp.com" ... const token = loginData.token;
// AND ... const loginData = await loginRes.json(); \n if (!loginData.token) return;
// We'll just replace the whole fetch block + token assignment.

const regex1 = /const\s+loginRes\s*=\s*await\s+fetch\([\s\S]*?body:\s*JSON\.stringify\(\{\s*email:\s*["']superadmin@erp\.com["'][\s\S]*?\}\)[\s\S]*?\}\);[\s\n]*const\s+loginData\s*=\s*await\s+loginRes\.json\(\);[\s\n]*const\s+token\s*=\s*loginData\.token;/g;

const regex2 = /const\s+loginRes\s*=\s*await\s+fetch\([\s\S]*?body:\s*JSON\.stringify\(\{\s*email:\s*["']superadmin@erp\.com["'][\s\S]*?\}\)[\s\S]*?\}\);[\s\n]*const\s+loginData\s*=\s*await\s+loginRes\.json\(\);[\s\n]*if\s*\(!loginData\.token\)\s*return;/g;

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

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  if (content.match(regex1)) {
    content = content.replace(regex1, replacement1);
  }
  if (content.match(regex2)) {
    content = content.replace(regex2, replacement2);
  }
  
  // Custom single line
  const regex3 = /const\s+loginRes\s*=\s*await\s+fetch\([\s\S]*?["']superadmin@erp\.com["'][\s\S]*?\}\);[\s\n]*const\s+loginData\s*=\s*await\s+loginRes\.json\(\);[\s\n]*if\s*\(!loginData\.token\)\s*return;/g;
  if (content.match(regex3)) {
    content = content.replace(regex3, replacement2);
  }

  const regex4 = /const\s+loginRes\s*=\s*await\s+fetch\([\s\S]*?["']superadmin@erp\.com["'][\s\S]*?\}\);[\s\n]*const\s+loginData\s*=\s*await\s+loginRes\.json\(\);[\s\n]*const\s+token\s*=\s*loginData\.token;/g;
  if (content.match(regex4)) {
    content = content.replace(regex4, replacement1);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
    changedFiles++;
  }
});

console.log('Total files changed:', changedFiles);
