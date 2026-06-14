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

const regex = /const\s+loginRes\s*=\s*await\s+fetch\("http:\/\/localhost:4000\/api\/auth\/login",\s*\{\s*method:\s*"POST",\s*headers:\s*\{\s*"Content-Type":\s*"application\/json"\s*\},\s*body:\s*JSON.stringify\(\{ email: "superadmin@erp\.com", password: "password123" \}\)\s*\}\);\s*const\s+\{\s*token\s*\}\s*=\s*await\s+loginRes\.json\(\);/g;

const replacement = `const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  if (content.match(regex)) {
    content = content.replace(regex, replacement);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
    changedFiles++;
  }
});

console.log('Total files changed:', changedFiles);
