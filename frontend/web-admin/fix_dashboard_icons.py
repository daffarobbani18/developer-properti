import os, re

base = 'd:/Website/developer-properti/frontend/web-admin/src/app/(dashboard)'
files = ['crm/page.tsx', 'keuangan/page.tsx', 'proyek/page.tsx', 'inventory/page.tsx']

for file in files:
    fp = os.path.join(base, file)
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        original = content
        
        if file == 'crm/page.tsx':
            content = re.sub(
                r'<div className={lex h-11 w-11 items-center justify-center rounded-xl \ transition-transform duration-300 group-hover:scale-105}><menu\.icon weight="duotone" className={h-5 w-5 \} /></div>',
                r'<div className={icon-wrapper h-11 w-11 transition-transform duration-300 group-hover:scale-105 }><menu.icon weight="duotone" size={20} /></div>',
                content
            )
        elif file == 'keuangan/page.tsx':
            content = re.sub(
                r'<div\s+className={mb-4 flex h-12 w-12 items-center justify-center rounded-2xl \ transition-transform duration-300 group-hover:scale-105}\s*>\s*<item\.icon weight="duotone" className={h-6 w-6 \} />\s*</div>',
                r'<div className={mb-4 icon-wrapper h-12 w-12 transition-transform duration-300 group-hover:scale-105 }><item.icon weight="duotone" size={22} /></div>',
                content
            )
        elif file == 'proyek/page.tsx':
            content = re.sub(
                r'<div className={lex h-12 w-12 items-center justify-center rounded-2xl \ transition-transform duration-300 group-hover:scale-105}>\s*<menu\.icon weight="duotone" className={h-6 w-6 \} />\s*</div>',
                r'<div className={icon-wrapper h-12 w-12 transition-transform duration-300 group-hover:scale-105 }><menu.icon weight="duotone" size={22} /></div>',
                content
            )
        
        if content != original:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {file}")