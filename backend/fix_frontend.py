import os
import glob

files = glob.glob('d:/Website/developer-properti/frontend/web-admin/src/app/\(dashboard\)/**/*.tsx', recursive=True)
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'username: "admin"' in content:
        content = content.replace('username: "admin"', 'email: "superadmin@erp.com"')
        content = content.replace('password: "admin"', 'password: "password123"')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed", file)
