const fs = require('fs');

// 1. Patch FieldDailyReportScreen
const dailyPath = 'src/screens/pengawas/FieldDailyReportScreen.tsx';
let dailyContent = fs.readFileSync(dailyPath, 'utf8');

if (!dailyContent.includes('useOfflineQueue')) {
  dailyContent = dailyContent.replace(
    'import { getFieldDailyReports, submitDailyReport } from "../../services/api";',
    'import { getFieldDailyReports, submitDailyReport } from "../../services/api";\nimport { useOfflineQueue } from "../../hooks/useOfflineQueue";'
  );
  
  // Inject the hook at the beginning of the component
  dailyContent = dailyContent.replace(
    'export default function FieldDailyReportScreen() {',
    'export default function FieldDailyReportScreen() {\n  const { enqueueAction } = useOfflineQueue(useAuth().auth);'
  );
  
  // Replace the submit try/catch
  const submitLogic = `const payload = {
        date: todayDate,
        summary,
        activities: activities.split("\\n").filter((a) => a.trim()),
        weather: modalWeather,
        photoUrls: [],
        isDraft: false,
      };
      
      let newReport: any;
      try {
        newReport = await submitDailyReport(auth, payload);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        await enqueueAction("DAILY_REPORT", payload);
        // Fallback optimistic update
        newReport = { ...payload, id: "draft-" + Date.now() };
        setErrorMessage("Laporan gagal terkirim (Disimpan di antrean offline).");
      }

      setTodayDraft(newReport);
      setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
      setShowForm(false);`;

  dailyContent = dailyContent.replace(
    /const newReport = await submitDailyReport\(auth, \{[\s\S]*?\}\);[\s\S]*?setShowForm\(false\);[\s\S]*?await Haptics\.notificationAsync\(Haptics\.NotificationFeedbackType\.Success\);/g,
    submitLogic
  );
  
  fs.writeFileSync(dailyPath, dailyContent);
}


// 2. Patch InspectionDetailScreen
const inspectPath = 'src/screens/pengawas/InspectionDetailScreen.tsx';
let inspectContent = fs.readFileSync(inspectPath, 'utf8');

if (!inspectContent.includes('useOfflineQueue')) {
  inspectContent = inspectContent.replace(
    'import { getInspectionDefects, updateDefectStatus } from "../../services/api";',
    'import { getInspectionDefects, updateDefectStatus } from "../../services/api";\nimport { useOfflineQueue } from "../../hooks/useOfflineQueue";'
  );
  
  // Find where component starts, wait, InspectionDetailScreen accepts route, navigation props
  // It's probably `export default function InspectionDetailScreen({ route, navigation }: any) {`
  inspectContent = inspectContent.replace(
    /(export default function InspectionDetailScreen[\s\S]*?\{)/,
    '$1\n  const { enqueueAction } = useOfflineQueue(useAuth().auth);'
  );
  
  // Replace the update logic
  const updateLogic = `const payload = { defectId: id, status: newStatus };
      try {
        await updateDefectStatus(auth, id, newStatus);
      } catch (e) {
        await enqueueAction("DEFECT_UPDATE", payload);
        Alert.alert("Offline", "Perubahan status disimpan ke antrean offline.");
      }
      
      setDefects((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );`;

  inspectContent = inspectContent.replace(
    /await updateDefectStatus\(auth, id, newStatus\);\s*setDefects\(\(prev\) =>\s*prev\.map\(\(d\) => \(d\.id === id \? \{ \.\.\.d, status: newStatus \} : d\)\)\s*\);/g,
    updateLogic
  );
  
  fs.writeFileSync(inspectPath, inspectContent);
}

console.log("Patching complete");
