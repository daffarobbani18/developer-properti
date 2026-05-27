import os
import re

dirs = ['inventory', 'crm', 'keuangan', 'proyek', '']
base = 'd:/Website/developer-properti/frontend/web-admin/src/app/(dashboard)'

for d in dirs:
    fp = os.path.join(base, d, 'page.tsx')
    if not os.path.exists(fp): continue
    
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
        
    has_changes = False
    
    # Replace standard flex container for icons in stats map
    # <div className={lex h-11 w-11 items-center justify-center rounded-xl }>
    # -> <div className={icon-wrapper h-12 w-12 }>
    
    old_stat_container = r'<div className={lex h-11 w-11 items-center justify-center rounded-xl \$\{stat\.bg\}\}>(.*?)</div>'
    new_stat_container = r'<div className={icon-wrapper h-12 w-12 }>\1</div>'
    
    if re.search(old_stat_container, content):
        content = re.sub(old_stat_container, new_stat_container, content)
        has_changes = True

    # Same for ction.bg
    old_action_container = r'<div className={mb-3 flex h-11 w-11 items-center justify-center rounded-xl \$\{action\.bg\}.*?\}>(.*?)</div>'
    new_action_container = r'<div className={mb-3 icon-wrapper h-12 w-12 }>\1</div>'
    
    if re.search(old_action_container, content):
        content = re.sub(old_action_container, new_action_container, content)
        has_changes = True
        
    # Same for stat.bg in generic loops if any (like quickStats.bg)
    old_item_container = r'<div className={lex h-11 w-11 items-center justify-center rounded-xl \$\{item\.bg\}\}>(.*?)</div>'
    new_item_container = r'<div className={icon-wrapper h-12 w-12 }>\1</div>'
    if re.search(old_item_container, content):
        content = re.sub(old_item_container, new_item_container, content)
        has_changes = True
        
    # Replace badges
    old_badge_trend = r'<div className={lex items-center gap-1 rounded-full px-2 py-0\.5 text-\[11px\] font-semibold \$\{stat\.trendUp \? \'bg-emerald-50 text-emerald-600\' : \'bg-rose-50 text-rose-600\'\}\}>'
    new_badge_trend = r'<div className={stat.trendUp ? "badge-trend-up" : "badge-trend-down"}>'
    if re.search(old_badge_trend, content):
        content = re.sub(old_badge_trend, new_badge_trend, content)
        has_changes = True

    if has_changes:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Applied premium styles to {fp}')
