const fs = require('fs');
const files = [
  'src/lib/keuangan-data.ts',
  'src/lib/crm-data.ts',
  'src/lib/legal-data.ts',
  'src/lib/proyek-data.ts'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/export const (\w+):\s*([a-zA-Z0-9<>[\]]+)\s*=\s*\[[\s\S]*?\];/g, 'export const $1: $2 = [];');
  
  content = content.replace(/export const laporanBulanan: LaporanKeuangan = \{[\s\S]*?\};/g, 'export const laporanBulanan: LaporanKeuangan = { periode: "Current", totalPemasukan: 0, totalPengeluaran: 0, labaKotor: 0, proyekAktif: 0 };');

  content = content.replace(/export const activeProject: Proyek = \{[\s\S]*?\};/g, 'export const activeProject: Proyek = { id: "", name: "No Project", location: "", totalUnits: 0, status: "perencanaan", progress: 0, totalArea: "", facilities: [], typeUnits: [], targetSelesai: "", gambarProyek: "" };');

  fs.writeFileSync(file, content);
  console.log('Cleared mock data in ' + file);
});
