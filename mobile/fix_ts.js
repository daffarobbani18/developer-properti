const fs = require('fs');

let typesPath = 'src/types/index.ts';
let typesContent = fs.readFileSync(typesPath, 'utf8');
typesContent = typesContent.replace('isResolved?: boolean;\n  isResolved?: boolean;', 'isResolved?: boolean;');
typesContent = typesContent.replace('isResolved?: boolean;\n  severity?: "critical" | "warning" | "info";\n  actionType?: string;\n  actionId?: string;\n  isResolved?: boolean;', 'isResolved?: boolean;\n  severity?: "critical" | "warning" | "info";\n  actionType?: string;\n  actionId?: string;');
fs.writeFileSync(typesPath, typesContent);

let contextPath = 'src/contexts/NotificationContext.tsx';
let contextContent = fs.readFileSync(contextPath, 'utf8');
contextContent = contextContent.replace("type === 'defect_alert'", "(type as string) === 'defect_alert'");
contextContent = contextContent.replace("type === 'deadline_alert'", "(type as string) === 'deadline_alert'");
fs.writeFileSync(contextPath, contextContent);
