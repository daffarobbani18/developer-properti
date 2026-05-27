import os, re

base = 'd:/Website/developer-properti/frontend/web-admin/src/app/(dashboard)'

# Look for typical icon containers: rounded full or lg with bg-50/100 and text-500/600
pattern = re.compile(r'className="[^"]*(?:h-10|h-12|h-8)[^"]*bg-([a-z]+)-(?:50|100)[^"]*text-\1-(?:500|600)[^"]*"')

for root, dirs, files in os.walk(base):
    for file in files:
        if file.endswith('.tsx'):
            fp = os.path.join(root, file)
            with open(fp, 'r', encoding='utf-8') as f:
                content = f.read()
            matches = pattern.finditer(content)
            for m in matches:
                print(f"{fp}: {m.group(0)}")