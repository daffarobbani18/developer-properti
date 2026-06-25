const fs = require('fs');

const typesPath = 'src/types/index.ts';
let typesContent = fs.readFileSync(typesPath, 'utf8');

// Update NotificationItem
if (!typesContent.includes('severity?:')) {
  typesContent = typesContent.replace(
    'isRead: boolean;',
    'isRead: boolean;\n  isResolved?: boolean;\n  severity?: "critical" | "warning" | "info";\n  actionType?: string;\n  actionId?: string;'
  );
  fs.writeFileSync(typesPath, typesContent);
  console.log('types updated');
} else {
  console.log('types already updated');
}
