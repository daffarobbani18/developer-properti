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
  'Clock3': 'Clock',
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
  'Lock': 'Lock',
  'Trash': 'Trash',
  'Pencil': 'Pencil',
  'EyeOff': 'EyeSlash',
  'Camera': 'Camera',
  'Video': 'VideoCamera',
  'FileCheck2': 'FileCheck',
  'LayoutGrid': 'SquaresFour',
  'Maximize2': 'CornersOut',
  'KanbanSquare': 'Kanban',
  'House': 'House',
  'Pulse': 'Pulse',
  'UsersThree': 'UsersThree',
  'TrendUp': 'TrendUp',
  'CalendarCheck2': 'CalendarCheck',
  'BuildingRound': 'Buildings'
}

base = 'd:/Website/developer-properti/frontend/web-admin/src'

for root, dirs, files in os.walk(base):
    for file in files:
        if not file.endswith('.tsx') and not file.endswith('.ts'):
            continue
            
        fp = os.path.join(root, file)
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Match multiline lucide-react imports
        lucide_re = r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"];?'
        matches = list(re.finditer(lucide_re, content))
        
        has_changes = False
        
        for m in matches:
            has_changes = True
            import_str = m.group(1)
            # handle comments or newlines
            import_str_clean = re.sub(r'//.*', '', import_str)
            icons = [i.strip() for i in import_str_clean.replace('\n', '').split(',') if i.strip()]
            new_icons = set()
            
            for icon in icons:
                # Some might have 'as' aliases e.g. Icon as MyIcon, ignore for now or handle
                if ' as ' in icon:
                    icon = icon.split(' as ')[0].strip()
                
                new_icon = icon_map.get(icon, icon)
                new_icons.add(new_icon)
                
                if new_icon != icon:
                    # Replace word-wise
                    content = re.sub(rf'\b{icon}\b', new_icon, content)
                    
            new_import = f'import {{\n  {", ".join(new_icons)}\n}} from "@phosphor-icons/react";'
            content = content.replace(m.group(0), new_import)
            
        if has_changes:
            # Add weight="duotone" to tags
            for v in set(icon_map.values()):
                tag_re = rf'<{v}\b(?![^>]*\bweight=)'
                content = re.sub(tag_re, f'<{v} weight="duotone"', content)
                
            # For dynamic icons: <Icon className= -> <Icon weight="duotone" className=
            content = re.sub(r'<([A-Z][a-zA-Z]*)\b(?![^>]*\bweight=)([^>]*\bclassName=)', r'<\1 weight="duotone"\2', content)
            
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {fp}')
