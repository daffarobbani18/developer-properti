import os, re

base = 'd:/Website/developer-properti/frontend/web-admin/src/app/(dashboard)'

for root, dirs, files in os.walk(base):
    for file in files:
        if file.endswith('.tsx'):
            fp = os.path.join(root, file)
            with open(fp, 'r', encoding='utf-8') as f:
                content = f.read()
            original = content
            
            # Reduce margin-bottom of icon wrapper container from mb-4 to mb-3
            # Typical pattern: <div className="mb-4 flex items-start justify-between">
            content = re.sub(r'className="mb-4 flex items-start justify-between"', 'className="mb-3 flex items-start justify-between"', content)
            
            # Change icon-wrapper h-12 w-12 to h-10 w-10 and icon size from 22/24 to 20
            # E.g. <div className={icon-wrapper h-12 w-12 ...}><... size={22} /></div>
            content = re.sub(r'icon-wrapper h-12 w-12', 'icon-wrapper h-10 w-10', content)
            content = re.sub(r'size=\{22\}', 'size={20}', content)
            content = re.sub(r'size=\{24\}', 'size={20}', content)
            
            if content != original:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {fp}")