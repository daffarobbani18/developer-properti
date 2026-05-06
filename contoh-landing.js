import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Map, Users, CircleDollarSign, 
  Scale, HardHat, ArrowRight, Lock, 
  ChevronRight, Fingerprint, Network, Server,
  Activity, Database, Cpu
} from 'lucide-react';

// --- Komponen Animasi Premium ---
const Reveal = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const currentRef = domRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const getTransform = () => {
    switch(direction) {
      case 'up': return 'translate-y-16';
      case 'down': return '-translate-y-16';
      case 'left': return 'translate-x-16';
      case 'right': return '-translate-x-16';
      default: return 'translate-y-16';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : `opacity-0 ${getTransform()} scale-95`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setMounted(true);
    // Jam Real-time untuk System Status
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour12: false }) + ' WIB');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const roles = [
    {
      id: 'super-admin',
      title: 'Super Admin',
      subtitle: 'IT & Project Manager',
      icon: ShieldAlert,
      color: 'text-rose-500',
      borderGlow: 'group-hover:border-rose-500/50',
      shadowGlow: 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]',
      gradient: 'from-rose-500/10 to-transparent',
      tasks: ['Kontrol penuh arsitektur sistem.', 'Manajemen akses kredensial.', 'Audit trail log aktivitas.', 'Laporan eksekutif menyeluruh.']
    },
    {
      id: 'inventory',
      title: 'Admin Inventory',
      subtitle: 'Land & Asset Acquisition',
      icon: Map,
      color: 'text-emerald-500',
      borderGlow: 'group-hover:border-emerald-500/50',
      shadowGlow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
      gradient: 'from-emerald-500/10 to-transparent',
      tasks: ['Input master data kavling.', 'Pembaruan Interactive Site Plan.', 'Pengaturan harga & spesifikasi.', 'Sinkronisasi stok real-time.']
    },
    {
      id: 'sales',
      title: 'Sales & Marketing',
      subtitle: 'Customer Relationship',
      icon: Users,
      color: 'text-blue-500',
      borderGlow: 'group-hover:border-blue-500/50',
      shadowGlow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]',
      gradient: 'from-blue-500/10 to-transparent',
      tasks: ['Manajemen database Leads.', 'Eksekusi Booking/NUP.', 'Penjadwalan Site Visit.', 'Konversi prospek ke pesanan.']
    },
    {
      id: 'finance',
      title: 'Finance & Treasury',
      subtitle: 'Accounting & Billing',
      icon: CircleDollarSign,
      color: 'text-amber-500',
      borderGlow: 'group-hover:border-amber-500/50',
      shadowGlow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]',
      gradient: 'from-amber-500/10 to-transparent',
      tasks: ['Verifikasi mutasi pembayaran.', 'Penerbitan kuitansi digital.', 'Manajemen pencairan KPR.', 'Otomatisasi status unit Lunas.']
    },
    {
      id: 'legal',
      title: 'Tim Legalitas',
      subtitle: 'Document & Compliance',
      icon: Scale,
      color: 'text-purple-500',
      borderGlow: 'group-hover:border-purple-500/50',
      shadowGlow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]',
      gradient: 'from-purple-500/10 to-transparent',
      tasks: ['Validasi KYC pelanggan.', 'Penerbitan PPJB dan AJB.', 'Pemantauan pecah sertifikat.', 'Cetak dokumen BAST.']
    },
    {
      id: 'pengawas',
      title: 'Field Supervisor',
      subtitle: 'Construction Engineering',
      icon: HardHat,
      color: 'text-orange-500',
      borderGlow: 'group-hover:border-orange-500/50',
      shadowGlow: 'group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]',
      gradient: 'from-orange-500/10 to-transparent',
      tasks: ['Akses Surat Perintah Kerja.', 'Input persentase progres.', 'Unggah dokumentasi foto.', 'Tindak lanjut tiket komplain.']
    }
  ];

  return (
    <div className="min-h-screen bg-[#050507] font-sans text-zinc-300 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden relative">
      
      {/* ================= BACKGROUND LAYERS (MENGATASI KESAN POLOS) ================= */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Layer 1: Gambar Arsitektur Gelap untuk Tekstur */}
        <div className="absolute inset-0 opacity-[0.07] mix-blend-screen scale-105 animate-[pulse_30s_ease-in-out_infinite]">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Corporate Core" 
            className="w-full h-full object-cover grayscale"
          />
        </div>

        {/* Layer 2: Grid Teknis (Blueprint / Cyber) */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', 
            backgroundSize: '60px 60px',
            backgroundPosition: 'center center'
          }}
        ></div>

        {/* Layer 3: Vignette / Bayangan Tepi agar fokus ke tengah */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050507_80%)]"></div>

        {/* Layer 4: Ambient Glow Orbs (Lebih Dinamis) */}
        <div className="absolute -top-40 left-[10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-[pulse_15s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute -bottom-40 left-[30%] w-[700px] h-[700px] bg-emerald-600/5 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      {/* ================= TOP TICKER (SYSTEM STATUS) ================= */}
      <div className={`relative z-50 w-full bg-zinc-950/80 border-b border-white/5 py-1.5 px-6 flex justify-between items-center text-[9px] uppercase tracking-[0.3em] font-medium transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center gap-4 text-zinc-500">
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            System Online
          </span>
          <span className="hidden md:inline border-l border-white/10 pl-4">Node: GPD-CORE-01</span>
          <span className="hidden md:inline border-l border-white/10 pl-4">Latency: 12ms</span>
        </div>
        <div className="text-amber-500/80 font-mono tracking-widest">{currentTime}</div>
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className={`relative z-50 w-full transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} bg-transparent py-6`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-md opacity-20 rounded-md"></div>
              <div className="w-10 h-10 flex items-center justify-center border border-amber-500/30 bg-zinc-900/80 backdrop-blur-sm rounded-md transform rotate-45 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <span className="font-serif font-bold text-lg text-transparent bg-clip-text bg-gradient-to-br from-amber-100 to-amber-500 transform -rotate-45">G</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-white tracking-[0.2em] uppercase text-sm">Griya<span className="font-light">Persada</span></span>
              <span className="text-[8px] text-amber-500 uppercase tracking-widest font-medium">Enterprise Portal</span>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex items-center gap-6">
            <span className="hidden lg:flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <Lock size={12} className="text-amber-500" /> AES-256 Encrypted
            </span>
            <button className="group px-6 py-3 bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-3">
              Otorisasi Login 
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-24 pb-20 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
            <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="inline-flex items-center justify-center gap-3 px-4 py-2 border border-amber-500/20 bg-amber-500/5 backdrop-blur-md rounded-full mb-8 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]">
                <Fingerprint size={14} className="text-amber-500" />
                <span className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-semibold">Sistem Manajemen Terpadu</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-8 tracking-tight">
                Pusat Kendali <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 italic font-light">Operasional.</span>
              </h1>
              
              <p className="text-zinc-400 font-light text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
                Portal eksklusif bagi manajemen dan staf Griya Persada. Sistem ini menggunakan arsitektur <strong className="text-zinc-200 font-medium">Role-Based Access Control (RBAC)</strong> untuk menjaga integritas dan kerahasiaan data perusahaan.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                <span className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded-sm bg-white/5"><Database size={12} className="text-blue-500"/> Terhubung ke Database Pusat</span>
                <span className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded-sm bg-white/5"><Activity size={12} className="text-emerald-500"/> Real-time Sync</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= ROLES GRID (DIREKTORI) ================= */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-zinc-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-2xl font-serif text-white mb-3">Direktori Otoritas</h2>
            <p className="text-sm text-zinc-500 font-light max-w-lg mx-auto">Pilih departemen Anda untuk melihat spesifikasi akses, batas wewenang, dan tanggung jawab modul operasional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <Reveal key={role.id} delay={index * 100} direction="up">
                  <div className={`group relative bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-2xl p-8 h-full transition-all duration-500 hover:-translate-y-2 ${role.shadowGlow} ${role.borderGlow} overflow-hidden cursor-default`}>
                    
                    {/* Efek Sorotan (Glow) di dalam Card */}
                    <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${role.gradient} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
                    
                    {/* Ikon Watermark Besar */}
                    <div className="absolute -right-6 -bottom-6 opacity-[0.03] transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 pointer-events-none text-white">
                      <Icon size={160} />
                    </div>

                    {/* Card Header */}
                    <div className="flex items-start gap-5 mb-8 relative z-10 border-b border-white/5 pb-6">
                      <div className={`w-14 h-14 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center flex-shrink-0 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)] group-hover:border-${role.color.split('-')[1]}-500/30 transition-colors`}>
                        <Icon className={`${role.color}`} size={28} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-zinc-100 mb-1.5 group-hover:text-white transition-colors">{role.title}</h3>
                        <p className={`text-[9px] uppercase tracking-[0.2em] font-bold ${role.color}`}>{role.subtitle}</p>
                      </div>
                    </div>

                    {/* Card Body (Tasks List) */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <Network size={14} className="text-zinc-600" />
                        <h4 className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">Tanggung Jawab Modul</h4>
                      </div>
                      <ul className="space-y-3.5">
                        {role.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <ChevronRight size={14} className={`${role.color} mt-0.5 flex-shrink-0 opacity-70 group-hover:translate-x-1 transition-transform`} />
                            <span className="text-xs font-light text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed">
                              {task}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA / SECURITY BANNER ================= */}
      <section className="py-24 relative z-10 overflow-hidden">
        {/* Latar CTA */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-900/10"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-8 shadow-inner shadow-black">
              <ShieldAlert size={28} className="text-amber-600" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-3xl font-serif text-white mb-6">Area Restriksi Internal</h2>
            <p className="text-zinc-400 font-light text-sm leading-relaxed mb-12 max-w-2xl mx-auto">
              Anda memasuki portal yang dilindungi oleh hukum. Penggunaan akun, modifikasi data, dan pencetakan dokumen di dalam sistem ini terekam secara otomatis. Pastikan Anda memiliki wewenang yang sah sebelum melanjutkan.
            </p>
            
            <button className="relative overflow-hidden group px-10 py-5 bg-amber-600 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:shadow-[0_10px_50px_rgba(245,158,11,0.4)] flex items-center justify-center gap-4 mx-auto">
              {/* Tombol dengan efek sapuan cahaya (shine) */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 z-0"></div>
              
              <Lock size={16} className="relative z-10" /> 
              <span className="relative z-10">Autentikasi Sekarang</span>
              <ArrowRight size={16} className="relative z-10 transform group-hover:translate-x-2 transition-transform" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ================= COPYRIGHT ================= */}
      <footer className="py-8 border-t border-white/5 bg-zinc-950 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-zinc-600" />
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Griya Persada ERP System v2.4.0</p>
          </div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>

      {/* CSS Khusus untuk animasi shine di tombol */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(200%) skewX(12deg); }
        }
      `}} />
    </div>
  );
}