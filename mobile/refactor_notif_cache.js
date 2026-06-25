const fs = require('fs');
const file = 'src/contexts/NotificationContext.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  /const LOCAL_READ_KEY = "@simdp:local_read_notifs";\s*const LOCAL_RESOLVED_KEY = "@simdp:local_resolved_notifs";/,
  `const getCacheKey = (role: string, userId: string, type: 'read' | 'resolved') => {
  return \`@simdp:\${role}:\${userId}:local_\${type}_notifs\`;
};`
);

c = c.replace(
  /\/\/ Load from AsyncStorage on mount\s*useEffect\(\(\) => \{\s*const loadCache = async \(\) => \{\s*try \{\s*const \[readCache, resCache\] = await Promise\.all\(\[\s*AsyncStorage\.getItem\(LOCAL_READ_KEY\),\s*AsyncStorage\.getItem\(LOCAL_RESOLVED_KEY\)\s*\]\);\s*if \(readCache\) setLocalRead\(new Set\(JSON\.parse\(readCache\)\)\);\s*if \(resCache\) setLocalResolved\(new Set\(JSON\.parse\(resCache\)\)\);\s*\} catch \(e\) \{\s*console\.warn\("Failed to load notification cache"\);\s*\}\s*\};\s*loadCache\(\);\s*\}, \[\]\);/m,
  `// Load from AsyncStorage when auth changes
  useEffect(() => {
    if (!auth) {
      setLocalRead(new Set());
      setLocalResolved(new Set());
      setNotifications([]);
      return;
    }

    const readKey = getCacheKey(auth.user.role, auth.user.id, 'read');
    const resKey = getCacheKey(auth.user.role, auth.user.id, 'resolved');

    const loadCache = async () => {
      try {
        const [readCache, resCache] = await Promise.all([
          AsyncStorage.getItem(readKey),
          AsyncStorage.getItem(resKey)
        ]);
        if (readCache) setLocalRead(new Set(JSON.parse(readCache)));
        else setLocalRead(new Set());

        if (resCache) setLocalResolved(new Set(JSON.parse(resCache)));
        else setLocalResolved(new Set());
      } catch (e) {
        console.warn("Failed to load notification cache");
      }
    };
    loadCache();
  }, [auth]);`
);

c = c.replace(
  /AsyncStorage\.setItem\(LOCAL_RESOLVED_KEY, JSON\.stringify\(Array\.from\(next\)\)\)\.catch\(\(\) => \{\}\);/g,
  `const resKey = getCacheKey(auth.user.role, auth.user.id, 'resolved');
      AsyncStorage.setItem(resKey, JSON.stringify(Array.from(next))).catch(() => {});`
);

c = c.replace(
  /AsyncStorage\.setItem\(LOCAL_READ_KEY, JSON\.stringify\(Array\.from\(next\)\)\)\.catch\(\(\) => \{\}\);/g,
  `const readKey = getCacheKey(auth.user.role, auth.user.id, 'read');
      AsyncStorage.setItem(readKey, JSON.stringify(Array.from(next))).catch(() => {});`
);

fs.writeFileSync(file, c);
console.log("Updated cache isolation in NotificationContext.tsx");
