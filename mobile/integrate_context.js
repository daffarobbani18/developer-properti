const fs = require('fs');

// 1. Add isResolved to NotificationItem in types/index.ts
let typesPath = 'src/types/index.ts';
let typesContent = fs.readFileSync(typesPath, 'utf8');
if (!typesContent.includes('isResolved?: boolean;')) {
  typesContent = typesContent.replace(
    'isRead: boolean;',
    'isRead: boolean;\n  isResolved?: boolean;'
  );
  fs.writeFileSync(typesPath, typesContent);
}

// 2. Wrap AppNavigator with NotificationProvider in AppNavigator.tsx
let appNavPath = 'src/navigation/AppNavigator.tsx';
let appNavContent = fs.readFileSync(appNavPath, 'utf8');

if (!appNavContent.includes('NotificationProvider')) {
  appNavContent = "import { NotificationProvider } from '../contexts/NotificationContext';\n" + appNavContent;
  appNavContent = appNavContent.replace(
    /return \(\s*<FieldStack\.Navigator/,
    'return (\n      <NotificationProvider>\n        <FieldStack.Navigator'
  );
  appNavContent = appNavContent.replace(
    /<\/FieldStack\.Navigator>\s*\);/g,
    '</FieldStack.Navigator>\n      </NotificationProvider>\n    );'
  );
  fs.writeFileSync(appNavPath, appNavContent);
}

console.log('AppNavigator and types updated.');
