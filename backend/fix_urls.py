import os
import glob

files = glob.glob('d:/Website/developer-properti/frontend/web-admin/src/app/**/*.tsx', recursive=True)
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    if 'http://localhost:4000/api/property-types' in content:
        content = content.replace('http://localhost:4000/api/property-types', 'http://localhost:4000/api/inventory/types')
        modified = True
    if 'http://localhost:4000/api/units' in content:
        content = content.replace('http://localhost:4000/api/units', 'http://localhost:4000/api/inventory/units')
        modified = True
        
    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed URLs in", file)
