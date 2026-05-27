import os, re

base = 'd:/Website/developer-properti/frontend/web-admin/src'

# 1. Icon name corrections (wrong Phosphor names → correct Phosphor names)
icon_name_fixes = {
    'Mail': 'Envelope',
    'ShieldAlert': 'ShieldWarning',
    'Code2': 'Code',
    'XIcon': 'X',
    'CheckCheck': 'CheckCircle',
    'KanbanSquare': 'Kanban',
    'MoreHorizontal': 'DotsThree',
    'MoreVertical': 'DotsThreeVertical',
    'ExternalLink': 'ArrowSquareOut',
    'ChevronRight': 'CaretRight',
    'ChevronLeft': 'CaretLeft',
    'ChevronDown': 'CaretDown',
    'ChevronUp': 'CaretUp',
    'LogOut': 'SignOut',
    'Maximize2': 'CornersOut',
    'Maximize': 'CornersOut',
    'BedDouble': 'Bed',
    'Bath': 'Bathtub',
    'AlertCircle': 'WarningCircle',
    'AlertTriangle': 'Warning',
    'BadgeCheck': 'SealCheck',
    'Building2': 'Buildings',
    'Building': 'Buildings',
    'DollarSign': 'CurrencyDollar',
    'Banknote': 'CurrencyDollar',
    'TrendingUp': 'TrendUp',
    'TrendingDown': 'TrendDown',
    'Users': 'UsersThree',
    'UserRound': 'User',
    'Scale': 'Scales',
    'Activity': 'Pulse',
    'Search': 'MagnifyingGlass',
    'Filter': 'Funnel',
    'Edit': 'PencilSimple',
    'Edit2': 'PencilSimple',
    'Edit3': 'PencilSimple',
    'Trash2': 'Trash',
    'UploadCloud': 'CloudArrowUp',
    'LayoutDashboard': 'SquaresFour',
    'LayoutGrid': 'SquaresFour',
    'Map': 'MapTrifold',
    'CalendarDays': 'CalendarBlank',
    'CalendarCheck2': 'CalendarCheck',
    'Menu': 'List',
    'Home': 'House',
    'Box': 'Package',
    'FileCheck2': 'FileCheck',
    'Clock3': 'Clock',
    'CheckCircle2': 'CheckCircle',
    'ArrowUpDown': 'ArrowsDownUp',
    'ArrowRight': 'ArrowRight',
    'Wallet': 'Wallet',
    'Receipt': 'Receipt',
    'FileText': 'FileText',
    'Settings': 'Gear',
    'ShieldCheck': 'ShieldCheck',
    'Phone': 'Phone',
    'MapPin': 'MapPin',
    'HardHat': 'HardHat',
    'Hammer': 'Hammer',
    'Upload': 'Upload',
    'Plus': 'Plus',
    'X': 'X',
    'Bell': 'Bell',
    'Eye': 'Eye',
    'Printer': 'Printer',
    'Download': 'DownloadSimple',
    'CreditCard': 'CreditCard',
    'CalendarClock': 'CalendarCheck',
    'SortAsc': 'SortAscending',
    'SortDesc': 'SortDescending',
    'Info': 'Info',
    'Check': 'Check',
    'Lock': 'Lock',
    'Unlock': 'LockOpen',
    'Image': 'Image',
    'Camera': 'Camera',
    'RefreshCw': 'ArrowsClockwise',
    'Refresh': 'ArrowsClockwise',
    'ArrowUpRight': 'ArrowUpRight',
    'Briefcase': 'Briefcase',
    'MessageSquare': 'ChatCircle',
    'UserPlus': 'UserPlus',
    'Calendar': 'Calendar',
    'EyeOff': 'EyeSlash',
}

# 2. Non-icon elements that should NOT have weight prop
# These are HTML elements and non-Phosphor React components
non_icon_tags = [
    'Link', 'Button', 'Card', 'CardContent', 'CardHeader', 'CardTitle', 'CardDescription', 'CardFooter',
    'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell', 'TableFooter',
    'Dialog', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogDescription', 'DialogFooter',
    'DialogTrigger', 'DialogClose', 'DialogOverlay', 'DialogPortal',
    'Select', 'SelectTrigger', 'SelectContent', 'SelectItem', 'SelectValue', 'SelectGroup', 'SelectLabel',
    'Badge', 'Input', 'Label', 'Textarea', 'Checkbox', 'Switch',
    'Sheet', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetDescription', 'SheetFooter',
    'Tabs', 'TabsContent', 'TabsList', 'TabsTrigger',
    'DropdownMenu', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuTrigger',
    'Separator', 'ScrollArea', 'Tooltip', 'TooltipContent', 'TooltipTrigger',
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'button', 'a', 'nav', 'header', 'section', 'article', 'aside', 'main', 'footer',
    'ul', 'li', 'ol', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
    'form', 'input', 'textarea', 'select', 'option',
]

def fix_file(fp):
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix wrong icon names in import statements and usage
    for wrong, correct in icon_name_fixes.items():
        if wrong == correct:
            continue
        # Only replace if it's actually used as an icon (in import from phosphor or in JSX)
        # Use word boundaries
        content = re.sub(rf'\b{re.escape(wrong)}\b', correct, content)
    
    # Remove weight="duotone" from non-icon elements
    for tag in non_icon_tags:
        # Pattern: <TagName weight="duotone" or <TagName\n  weight="duotone"
        # Remove just the weight attribute
        content = re.sub(
            rf'(<{re.escape(tag)}\b[^>]*?)\s+weight="duotone"',
            r'\1',
            content,
            flags=re.DOTALL
        )
        # Also handle weight="duotone" at the beginning right after tag name
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
        return True
    return False

count = 0
for root, dirs, files in os.walk(base):
    # Skip node_modules
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fp = os.path.join(root, file)
            if fix_file(fp):
                count += 1
                print(f'Fixed: {fp}')

print(f'Total files fixed: {count}')