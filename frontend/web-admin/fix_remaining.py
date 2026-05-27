import os, re

base = 'd:/Website/developer-properti/frontend/web-admin/src'

icon_fixes = {
    'MessageCircle': 'ChatCircle',
    'FileCheck': 'FileText', # fallback
    'Server': 'HardDrives',
    'Quote': 'Quotes',
    'CircleDollarSign': 'CurrencyDollar',
    'ChevronRightIcon': 'CaretRight',
    'ChevronUpIcon': 'CaretUp',
    'ChevronDownIcon': 'CaretDown',
}

# Remove weight="duotone" from specific non-icon tags
non_icon_tags = ['Progress', 'Reveal']

for root, dirs, files in os.walk(base):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fp = os.path.join(root, file)
            with open(fp, 'r', encoding='utf-8') as f:
                content = f.read()
            original = content
            
            for wrong, correct in icon_fixes.items():
                content = re.sub(rf'\b{re.escape(wrong)}\b', correct, content)

            for tag in non_icon_tags:
                content = re.sub(
                    rf'(<{re.escape(tag)}\b[^>]*?)\s+weight="duotone"',
                    r'\1',
                    content,
                    flags=re.DOTALL
                )
                content = re.sub(
                    rf'(<{re.escape(tag)})\s+weight="duotone"(\s)',
                    r'\1\2',
                    content
                )
                content = re.sub(
                    rf'(<{re.escape(tag)})\s+weight="duotone">',
                    r'\1>',
                    content
                )
                
            if content != original:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed {fp}")
                