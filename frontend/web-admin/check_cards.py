import os, re

base = 'd:/Website/developer-properti/frontend/web-admin/src/app/(dashboard)'
pages_to_check = ['crm/page.tsx', 'keuangan/page.tsx', 'proyek/page.tsx', 'inventory/page.tsx']

for page in pages_to_check:
    fp = os.path.join(base, page)
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        # Find lines with bg-blue-50, bg-emerald-50, etc inside flex containers that look like icon wrappers
        matches = re.finditer(r'<div[^>]*className="[^"]*bg-(?:blue|emerald|amber|rose|violet|cyan|zinc)-(?:50|100)[^"]*"[^>]*>', content)
        for m in matches:
            print(f"{page}: {m.group(0)}")