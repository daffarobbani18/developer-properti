const fs = require('fs');

const appNavFile = 'src/navigation/AppNavigator.tsx';
let content = fs.readFileSync(appNavFile, 'utf8');

const importTabs = `import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";\nimport { Ionicons } from "@expo/vector-icons";\n`;
if (!content.includes('createBottomTabNavigator')) {
  content = content.replace('import { createNativeStackNavigator', importTabs + 'import { createNativeStackNavigator');
}

const tabNavigatorCode = `
const FieldTab = createBottomTabNavigator<FieldStackParamList>();

function FieldTabNavigator(): React.JSX.Element {
  return (
    <FieldTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home";
          if (route.name === "Beranda") iconName = focused ? "grid" : "grid-outline";
          else if (route.name === "FieldMilestones") iconName = focused ? "hammer" : "hammer-outline";
          else if (route.name === "FieldDailyReport") iconName = focused ? "journal" : "journal-outline";
          else if (route.name === "InspectionUnits") iconName = focused ? "shield-checkmark" : "shield-checkmark-outline";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#f59e0b",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e2e8f0",
          elevation: 8,
          shadowColor: "#0f172a",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        }
      })}
    >
      <FieldTab.Screen name="Beranda" component={FieldHomeScreen} options={{ tabBarLabel: "Home" }} />
      <FieldTab.Screen name="FieldMilestones" component={FieldMilestonesScreen} options={{ tabBarLabel: "Progres" }} />
      <FieldTab.Screen name="FieldDailyReport" component={FieldDailyReportScreen} options={{ tabBarLabel: "Laporan" }} />
      <FieldTab.Screen name="InspectionUnits" component={InspectionUnitsScreen} options={{ tabBarLabel: "Inspeksi" }} />
    </FieldTab.Navigator>
  );
}

function FieldNavigator(): React.JSX.Element {
   return (
      <FieldStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Beranda">
        <FieldStack.Screen name="Beranda" component={FieldTabNavigator} />
        <FieldStack.Screen name="FieldNotifikasi" component={FieldNotificationsScreen} />
        <FieldStack.Screen name="UnitDetail" component={FieldUnitDetailScreen} options={{ title: "Detail Unit" }} />
        <FieldStack.Screen name="UpdateHistory" component={FieldUpdateHistoryScreen} options={{ title: "Riwayat Update" }} />
        <FieldStack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: "Detail Proyek", headerShown: true, headerBackTitle: "Kembali" }} />
        <FieldStack.Screen name="FieldUnits" component={FieldUnitsScreen} options={{ title: "Daftar Unit" }} />
        
        {/* Detail screens for tabs */}
        <FieldStack.Screen name="InspectionDetail" component={InspectionDetailScreen} options={{ title: "Detail Inspeksi" }} />
        <FieldStack.Screen name="AddDefect" component={AddDefectScreen} options={{ title: "Lapor Komplain" }} />
      </FieldStack.Navigator>
    );
}
`;

content = content.replace(/function FieldNavigator\(\): React\.JSX\.Element \{\s*return \([\s\S]*?<\/FieldStack\.Navigator>\s*\);\s*\}/, tabNavigatorCode);

fs.writeFileSync(appNavFile, content);
console.log('AppNavigator modified to include FieldTabNavigator.');
