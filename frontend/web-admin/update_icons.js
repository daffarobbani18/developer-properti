const fs = require('fs');
const path = require('path');

const iconMap = {
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
};

const dirsToProcess = [
  'inventory', 'crm', 'keuangan', 'proyek', ''
];

const basePath = 'd:/Website/developer-properti/frontend/web-admin/src/app/(dashboard)';

for (const dir of dirsToProcess) {
  const filePath = path.join(basePath, dir, 'page.tsx');
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Find lucide-react imports
  const lucideRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;
  let match;
  let hasChanges = false;
  
  while ((match = lucideRegex.exec(content)) !== null) {
    const importStr = match[1];
    const icons = importStr.split(',').map(i => i.trim()).filter(i => i);
    
    const newIcons = new Set();
    icons.forEach(icon => {
      if (iconMap[icon]) {
        newIcons.add(iconMap[icon]);
        
        // Also replace usages in the file
        // Be careful not to replace partial words, use word boundaries
        const usageRegex = new RegExp('\\\\b' + icon + '\\\\b', 'g');
        content = content.replace(usageRegex, iconMap[icon]);
      } else {
        newIcons.add(icon); // Keep as is if mapping not found
      }
    });
    
    const newImportStr = import {  } from "@phosphor-icons/react";;
    content = content.replace(match[0], newImportStr);
    hasChanges = true;
  }

  // Inject weight="duotone" for standard usage like <IconName ... />
  // We can't do this blindly for all tags, but let's try to add it to known icons
  for (const newIcon of Object.values(iconMap)) {
    const tagStartRegex = new RegExp('<' + newIcon + '(\\\\s|>)', 'g');
    content = content.replace(tagStartRegex, (m, p1) => {
      if (m.includes('weight=')) return m;
      // if it's already got weight, ignore. Otherwise add
      if (p1 === '>') return < weight="duotone">;
      return < weight="duotone" ;
    });
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(Updated );
  }
}