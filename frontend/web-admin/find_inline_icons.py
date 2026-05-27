import os, re

base = 'd:/Website/developer-properti/frontend/web-admin/src/app/(dashboard)'

# Regex to find elements like <div className="... bg-blue-100 ... text-blue-600 ...">
# or similar light background utility classes on wrappers around icons.
pattern = re.compile(r'className="[^"]*bg-([a-z]+)-100[^"]*text-\1-[56]00[^"]*"')

for root, dirs, files in os.walk(base):
    for file in files:
        if file.endswith('.tsx'):
            fp = os.path.join(root, file)
            with open(fp, 'r', encoding='utf-8') as f:
                content = f.read()
            matches = pattern.finditer(content)
            for m in matches:
                print(f"{fp}: {m.group(0)}")