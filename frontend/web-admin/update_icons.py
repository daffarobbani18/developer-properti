import os
import re

icon_map = {
  'AlertCircle': 'WarningCircle',
  'Bath': 'Bathtub',
  'Bell': 'Bell',
  'Box': 'Package',
  'BedDouble': 'Bed',
  'CalendarDays': 'CalendarBlank',
  'ChevronRight': 'CaretRight',
  'Edit': 'PencilSimple',
  'Home': 'House',
  'LayoutDashboard': 'SquaresFour',
  'Map': 'MapTrifold',
  'MapPin': 'MapPin',
  'Maximize': 'CornersOut',
  'MoreVertical': 'DotsThreeVertical',
  'Menu': 'List',
  'Plus': 'Plus',
  'Search': 'MagnifyingGlass',
  'ShieldCheck': 'ShieldCheck',
  'Trash2': 'Trash',
  'UploadCloud': 'CloudArrowUp',
  'UserRound': 'User',
  'X': 'X',
  'ChevronLeft': 'CaretLeft',
  'Filter': 'Funnel',
  'Download': 'DownloadSimple',
  'Users': 'UsersThree',
  'FileText': 'FileText',
  'DollarSign': 'CurrencyDollar',
  'TrendingUp': 'TrendUp',
  'CheckCircle2': 'CheckCircle',
  'Settings': 'Gear',
  'LogOut': 'SignOut',
  'ArrowUpRight': 'ArrowUpRight',
  'Eye': 'Eye',
  'Upload': 'Upload',
  'Building2': 'Buildings',
  'Building': 'Buildings',
  'Briefcase': 'Briefcase',
  'Calendar': 'Calendar',
  'MessageSquare': 'ChatCircle',
  'Phone': 'Phone',
  'CreditCard': 'CreditCard',
  'Receipt': 'Receipt',
  'Clock': 'Clock',
  'Hammer': 'Hammer',
  'HardHat': 'HardHat',
  'Activity': 'Pulse',
  'Scale': 'Scales',
  'BadgeCheck': 'SealCheck',
  'AlertTriangle': 'Warning',
  'TrendingDown': 'TrendDown',
  'MoreHorizontal': 'DotsThree',
  'Image': 'Image',
  'ChevronDown': 'CaretDown',
  'ChevronUp': 'CaretUp',
  'Play': 'Play',
  'Pause': 'Pause',
  'Printer': 'Printer',
  'File': 'File',
  'Folder': 'Folder',
  'Tag': 'Tag',
  'Link': 'Link',
  'ExternalLink': 'ArrowSquareOut',
  'UserPlus': 'UserPlus',
  'Check': 'Check',
  'Lock': 'Lock'
}

dirs = ['inventory', 'crm', 'keuangan', 'proyek', '']
base = 'd:/Website/developer-properti/frontend/web-admin/src/app/(dashboard)'

for d in dirs:
    fp = os.path.join(base, d, 'page.tsx')
    if not os.path.exists(fp): continue
    
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
        
    has_changes = False
    
    # 1. find import
    lucide_re = r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"];?'
    matches = list(re.finditer(lucide_re, content))
    
    for m in matches:
        has_changes = True
        import_str = m.group(1)
        icons = [i.strip() for i in import_str.split(',') if i.strip()]
        new_icons = set()
        
        for icon in icons:
            new_icon = icon_map.get(icon, icon)
            new_icons.add(new_icon)
            if new_icon != icon:
                # Replace occurrences of the icon name word-wise in the file
                content = re.sub(rf'\b{icon}\b', new_icon, content)
                
        new_import = f'import {{ {", ".join(new_icons)} }} from "@phosphor-icons/react";'
        content = content.replace(m.group(0), new_import)
        
    if has_changes:
        # Add weight="duotone" to tags
        for v in set(icon_map.values()):
            tag_re = rf'<{v}\b(?![^>]*\bweight=)'
            content = re.sub(tag_re, f'<{v} weight="duotone"', content)
            
        # For rendering like <stat.icon className= -> <stat.icon weight="duotone" className=
        content = re.sub(r'<([a-zA-Z]+\.icon)\b(?![^>]*\bweight=)', r'<\1 weight="duotone"', content)
            
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {fp}')