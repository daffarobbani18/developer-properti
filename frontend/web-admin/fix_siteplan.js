const fs = require('fs');
const file = 'src/app/(dashboard)/admin/site-plan/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Match the full fetch-login block including any email or username/password pattern
const hackPattern = /const\s+loginRes\s*=\s*await\s+fetch\([^;]+\);\s*[\r\n]+\s*const\s+\{\s*token\s*\}\s*=\s*await\s+loginRes\.json\(\);/g;

const replacement = `const authDataStr = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      let token = "";
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        token = authData.token;
      }`;

const matches = content.match(hackPattern);
const count = matches ? matches.length : 0;

content = content.replace(hackPattern, replacement);
fs.writeFileSync(file, content, 'utf8');
console.log('Replaced', count, 'occurrences in site-plan/page.tsx');
