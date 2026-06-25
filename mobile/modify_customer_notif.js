const fs = require('fs');

let c = fs.readFileSync('src/navigation/AppNavigator.tsx', 'utf8');

if (!c.includes('CustomerNotificationsScreen')) {
  c = c.replace(
    'import { FieldUnitDetailScreen } from "../screens/pengawas/FieldUnitDetailScreen";',
    'import { CustomerNotificationsScreen } from "../screens/customer/CustomerNotificationsScreen";\nimport { FieldUnitDetailScreen } from "../screens/pengawas/FieldUnitDetailScreen";'
  );
  
  c = c.replace(
    /function CustomerNavigator\(\): React\.JSX\.Element \{\s*return \(\s*<CustomerStack\.Navigator/m,
    'function CustomerNavigator(): React.JSX.Element {\n  return (\n    <NotificationProvider>\n      <CustomerStack.Navigator'
  );
  
  c = c.replace(
    '<CustomerStack.Screen name="PhotoGallery"',
    '<CustomerStack.Screen name="CustomerNotifikasi" component={CustomerNotificationsScreen} />\n      <CustomerStack.Screen name="PhotoGallery"'
  );
  
  c = c.replace(
    /<\/CustomerStack\.Navigator>\s*\);\s*\}/m,
    '</CustomerStack.Navigator>\n    </NotificationProvider>\n  );\n}'
  );
  
  fs.writeFileSync('src/navigation/AppNavigator.tsx', c);
  console.log('AppNavigator.tsx updated.');
}

let nc = fs.readFileSync('src/contexts/NotificationContext.tsx', 'utf8');
if (!nc.includes('if (auth.user.role === "SITE_ENGINEER") {')) {
  nc = nc.replace(
    /const fetchNotifications = useCallback\(async \(silent = true\) => \{\s*if \(\!auth \|\| auth\.user\.role \!\=\= "SITE_ENGINEER"\) return;/m,
    'const fetchNotifications = useCallback(async (silent = true) => {\n    if (!auth) return;'
  );
  
  nc = nc.replace(
    /useEffect\(\(\) => \{\s*if \(\!auth \|\| auth\.user\.role \!\=\= "SITE_ENGINEER"\) return;\s*fetchNotifications\(false\);\s*const interval = setInterval\(\(\) => \{\s*fetchNotifications\(true\);\s*\}, 3 \* 60 \* 1000\);\s*return \(\) => clearInterval\(interval\);\s*\}, \[auth, fetchNotifications\]\);/m,
    `useEffect(() => {
    if (!auth) return;
    
    fetchNotifications(false);
    
    if (auth.user.role === "SITE_ENGINEER") {
      const interval = setInterval(() => {
        fetchNotifications(true);
      }, 3 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [auth, fetchNotifications]);`
  );
  
  fs.writeFileSync('src/contexts/NotificationContext.tsx', nc);
  console.log('NotificationContext.tsx updated.');
}

let ch = fs.readFileSync('src/screens/customer/CustomerHomeScreen.tsx', 'utf8');
if (!ch.includes('navigation.navigate("CustomerNotifikasi")')) {
  ch = ch.replace(
    /<Pressable style={styles.cleanListBadgeRow}>/m,
    '<Pressable style={styles.cleanListBadgeRow} onPress={() => navigation.navigate("CustomerNotifikasi")}>'
  );
  fs.writeFileSync('src/screens/customer/CustomerHomeScreen.tsx', ch);
  console.log('CustomerHomeScreen.tsx updated.');
}

let nm = fs.readFileSync('src/utils/notificationMapper.ts', 'utf8');
if (!nm.includes("if (type === 'PROJECT_UPDATE') return 'progress';")) {
  nm = nm.replace(
    /export function inferActionType\(n: NotificationItem\): string \| undefined \{\s*if \(n\.actionType\) return n\.actionType;\s*if \(n\.data\?\.route\) return n\.data\.route;\s*return n\.type;\s*\}/m,
    `export function inferActionType(n: NotificationItem): string | undefined {
  if (n.actionType) return n.actionType;
  if (n.data?.route) return n.data.route;
  
  const type = (n.type || "").toUpperCase();
  if (type === 'PROJECT_UPDATE') return 'progress';
  if (type === 'PAYMENT_UPDATE') return 'billing';
  if (type === 'GENERAL_INFO') return 'informasi';
  
  return n.type;
}`
  );
  fs.writeFileSync('src/utils/notificationMapper.ts', nm);
  console.log('notificationMapper.ts updated.');
}
