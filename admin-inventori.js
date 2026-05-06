import React, { useState } from 'react';
import { 
  LayoutDashboard, Map, Home, Box, Plus, 
  Search, Edit, Trash2, X, AlertCircle, 
  UploadCloud, MapPin, BedDouble, Bath, 
  Maximize, MoreVertical, ShieldCheck, Bell
} from 'lucide-react';

export default function App() {
  // === STATE MANAGEMENT ===
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

  // === DUMMY DATA ===
  const propertyTypes = [
    { id: 1, name: 'The Astoria', lt: 200, lb: 150, bed: 4, bath: 3, price: 2800000000 },
    { id: 2, name: 'The Bvlgari', lt: 250, lb: 210, bed: 5, bath: 4, price: 4500000000 },
    { id: 3, name: 'Magnolia', lt: 72, lb: 36, bed: 2, bath: 1, price: 450000000 },
  ];

  const units = [
    { id: 'BLK-A1', type: 'The Astoria', price: 2800000000, status: 'Tersedia' },
    { id: 'BLK-A2', type: 'The Astoria', price: 2850000000, status: 'Booked' },
    { id: 'BLK-C5', type: 'The Bvlgari', price: 4500000000, status: 'Terjual' },
    { id: 'BLK-D1', type: 'Magnolia', price: 450000000, status: 'Tersedia' },
    { id: 'BLK-D2', type: 'Magnolia', price: 450000000, status: 'Tersedia' },
  ];

  // Utility Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // === COMPONENT RENDERERS ===
  const renderDashboard = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-zinc-900 mb-2">Dasbor Inventaris</h2>
        <p className="text-sm text-zinc-500">Ringkasan ketersediaan aset properti saat ini.</p>
      </div>

      {/* Alert Stok Menipis */}
      <div className="flex items-center gap-4 bg-rose-50 border border-rose-100 p-4 rounded-xl mb-8">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="text-rose-600" size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-900">Peringatan Stok Menipis</h4>
          <p className="text-xs text-rose-700 mt-0.5">Sisa 2 unit tersedia untuk Tipe Magnolia. Pertimbangkan untuk membuka blok baru.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Unit Kavling', value: '150', icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Unit Tersedia', value: '45', icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Sedang Booked', value: '12', icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Sudah Terjual', value: '93', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-zinc-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 mb-6">Distribusi Stok per Tipe</h3>
        <div className="h-64 flex items-end justify-around gap-4 px-4 bg-zinc-50/50 rounded-xl border border-zinc-100 p-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full max-w-[80px] bg-amber-500 rounded-t-lg h-[80%] hover:bg-amber-400 transition-colors"></div>
            <span className="text-xs text-zinc-500">The Astoria</span>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full max-w-[80px] bg-emerald-500 rounded-t-lg h-[40%] hover:bg-emerald-400 transition-colors"></div>
            <span className="text-xs text-zinc-500">The Bvlgari</span>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full max-w-[80px] bg-blue-500 rounded-t-lg h-[20%] hover:bg-blue-400 transition-colors"></div>
            <span className="text-xs text-zinc-500">Magnolia</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypes = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-serif text-zinc-900 mb-2">Master Tipe Rumah</h2>
          <p className="text-sm text-zinc-500">Kelola spesifikasi dan harga dasar cetak biru properti.</p>
        </div>
        <button 
          onClick={() => setIsTypeModalOpen(true)}
          className="px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Tipe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="h-48 bg-zinc-100 relative overflow-hidden">
              {/* Image Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform duration-500">
                <Home size={64} strokeWidth={1} />
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-zinc-700 shadow-sm">
                Tipe {type.lt}/{type.lb}
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-serif text-zinc-900 mb-4">{type.name}</h4>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-zinc-600"><Maximize size={16} className="text-amber-600"/> LT {type.lt} m²</div>
                <div className="flex items-center gap-2 text-sm text-zinc-600"><Box size={16} className="text-amber-600"/> LB {type.lb} m²</div>
                <div className="flex items-center gap-2 text-sm text-zinc-600"><BedDouble size={16} className="text-amber-600"/> {type.bed} Kamar</div>
                <div className="flex items-center gap-2 text-sm text-zinc-600"><Bath size={16} className="text-amber-600"/> {type.bath} Mandi</div>
              </div>
              <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                <p className="text-lg font-bold text-zinc-900">{formatRupiah(type.price)}</p>
                <button className="text-zinc-400 hover:text-amber-600 transition-colors"><Edit size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUnits = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-zinc-900 mb-2">Data Kavling & Unit</h2>
          <p className="text-sm text-zinc-500">Database unit fisik berdasarkan blok dan nomor.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
            <input type="text" placeholder="Cari ID Blok..." className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
          </div>
          <button 
            onClick={() => setIsUnitModalOpen(true)}
            className="px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} /> Tambah Unit
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">ID Unit / Blok</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tipe Rumah</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Harga Spesifik</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {units.map((unit, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 transition-colors group">
                  <td className="py-4 px-6 text-sm font-bold font-mono text-zinc-900">{unit.id}</td>
                  <td className="py-4 px-6 text-sm font-medium text-zinc-600">{unit.type}</td>
                  <td className="py-4 px-6 text-sm font-medium text-zinc-900">{formatRupiah(unit.price)}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium 
                      ${unit.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${unit.status === 'Booked' ? 'bg-amber-100 text-amber-700' : ''}
                      ${unit.status === 'Terjual' ? 'bg-rose-100 text-rose-700' : ''}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full 
                        ${unit.status === 'Tersedia' ? 'bg-emerald-500' : ''}
                        ${unit.status === 'Booked' ? 'bg-amber-500' : ''}
                        ${unit.status === 'Terjual' ? 'bg-rose-500' : ''}
                      `}></span> 
                      {unit.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-400 hover:text-blue-600 bg-white border border-zinc-200 rounded-md"><Edit size={16} /></button>
                      <button className="p-2 text-zinc-400 hover:text-rose-600 bg-white border border-zinc-200 rounded-md"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSitePlan = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-zinc-900 mb-2">Master Site Plan</h2>
        <p className="text-sm text-zinc-500">Unggah dan kelola peta digital untuk Web Marketing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-dashed border-amber-200 bg-amber-50/30 rounded-2xl p-12 text-center hover:bg-amber-50 transition-colors cursor-pointer flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-amber-100 mb-4">
              <UploadCloud size={28} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Unggah Denah Baru</h3>
            <p className="text-sm text-zinc-500 max-w-sm mb-6">Tarik & Lepas file SVG/PNG denah interaktif di sini, atau klik untuk mencari file di komputer Anda.</p>
            <button className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors">
              Pilih File
            </button>
          </div>
        </div>

        {/* Active Plans List */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-6">Denah Aktif</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-zinc-100 rounded-xl bg-zinc-50">
              <div className="w-12 h-12 bg-white rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400">
                <Map size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900">Master Plan Tahap 1</h4>
                <p className="text-xs text-zinc-500">Diperbarui 2 hari lalu</p>
              </div>
              <MoreVertical size={16} className="text-zinc-400 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-amber-200 selection:text-amber-900 overflow-hidden">
      
      {/* ================= SIDEBAR (DARK PREMIUM) ================= */}
      <aside className="hidden md:flex w-72 bg-zinc-950 flex-col transition-all duration-300 relative z-20">
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center border border-amber-500/50 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg transform rotate-45 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <span className="font-serif font-bold text-lg text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-500 transform -rotate-45">G</span>
            </div>
            <span className="font-serif text-white tracking-widest uppercase text-sm">Griya<span className="font-light">Persada</span></span>
          </div>
        </div>

        <div className="px-8 py-6 border-b border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            AI
          </div>
          <div>
            <p className="text-white text-sm font-medium">Admin Inventory</p>
            <p className="text-emerald-500 text-xs font-light tracking-wider uppercase">Div. Perencanaan</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          <p className="px-4 text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-4">Modul Aset Lahan</p>
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dasbor Overview' },
            { id: 'types', icon: Home, label: 'Master Tipe Rumah' },
            { id: 'units', icon: Box, label: 'Data Kavling & Unit' },
            { id: 'siteplan', icon: Map, label: 'Site Plan Master' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-300'} />
                <span className={`text-sm font-medium ${isActive ? 'text-amber-500' : ''}`}>{item.label}</span>
                {isActive && <div className="ml-auto w-1 h-5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-zinc-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-10">
          <h1 className="text-xl md:text-2xl font-serif text-zinc-900">
            {activeMenu === 'dashboard' && 'Dasbor Overview'}
            {activeMenu === 'types' && 'Master Tipe Rumah'}
            {activeMenu === 'units' && 'Database Unit'}
            {activeMenu === 'siteplan' && 'Site Plan'}
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {activeMenu === 'dashboard' && renderDashboard()}
          {activeMenu === 'types' && renderTypes()}
          {activeMenu === 'units' && renderUnits()}
          {activeMenu === 'siteplan' && renderSitePlan()}
        </div>
      </main>

      {/* ================= MODAL: TAMBAH TIPE ================= */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-zinc-900">Input Master Tipe Baru</h3>
              <button onClick={() => setIsTypeModalOpen(false)} className="text-zinc-400 hover:text-rose-500 transition-colors p-1"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Nama Tipe Rumah</label>
                <input type="text" placeholder="Contoh: The Astoria Signature" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Luas Tanah (m²)</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Luas Bangunan (m²)</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Kamar Tidur</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Kamar Mandi</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Harga Dasar (Base Price)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">Rp</span>
                  <input type="number" placeholder="0" className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50/50 rounded-b-2xl">
              <button onClick={() => setIsTypeModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-200 rounded-lg transition-colors">Batal</button>
              <button className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-md shadow-amber-600/20 transition-all">Simpan Tipe Baru</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TAMBAH UNIT ================= */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-zinc-900">Registrasi Unit Kavling</h3>
              <button onClick={() => setIsUnitModalOpen(false)} className="text-zinc-400 hover:text-rose-500 transition-colors p-1"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">ID Blok & Nomor</label>
                <input type="text" placeholder="Contoh: BLK-A12" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Pilih Tipe Rumah</label>
                <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all appearance-none cursor-pointer">
                  <option value="" disabled selected>Pilih Tipe Master...</option>
                  {propertyTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name} - {formatRupiah(type.price)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">Penyesuaian Harga (Markup Hook/Taman)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">+ Rp</span>
                  <input type="number" placeholder="0" className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all" />
                </div>
                <p className="text-[10px] text-zinc-400 mt-2">Kosongkan jika harga sama dengan Base Price tipe master.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50/50 rounded-b-2xl">
              <button onClick={() => setIsUnitModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-200 rounded-lg transition-colors">Batal</button>
              <button className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-md shadow-amber-600/20 transition-all">Simpan Unit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}