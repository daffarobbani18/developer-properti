"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Car,
  Check,
  ChevronRight,
  Home,
  MapPin,
  Menu,
  Play,
  Shield,
  Star,
  TreePine,
  X,
} from "lucide-react";

const milestones = [
  {
    phase: "Tahap 1",
    title: "Pembukaan Lahan & Infrastruktur Dasar",
    status: "Selesai",
  },
  {
    phase: "Tahap 2",
    title: "Pembangunan Unit Show House",
    status: "Berjalan",
  },
  {
    phase: "Tahap 3",
    title: "Serah Terima Cluster Astoria",
    status: "Q4 2026",
  },
];

const faqs = [
  {
    q: "Apakah ini hanya preview website?",
    a: "Ya. Versi saat ini adalah preview frontend dengan konten hardcode untuk validasi desain dan alur halaman publik.",
  },
  {
    q: "Apakah data unit sudah real-time dari backend?",
    a: "Belum. Data status unit pada halaman ini masih dummy dan akan dihubungkan ke backend pada fase integrasi.",
  },
  {
    q: "Apakah form VIP sudah mengirim ke CRM?",
    a: "Belum. Form saat ini untuk simulasi UI/UX. Integrasi ke API dan CRM akan dikerjakan pada tahap berikutnya.",
  },
];

function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentRef = domRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return "translate-y-12";
      case "down":
        return "-translate-y-12";
      case "left":
        return "translate-x-12";
      case "right":
        return "-translate-x-12";
      default:
        return "translate-y-12";
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0 scale-100"
          : `opacity-0 ${getTransform()} scale-95`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeKavling, setActiveKavling] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900 selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden">
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-4 shadow-sm"
            : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center border-2 border-amber-600 rounded-sm transform rotate-45">
              <span
                className={`font-serif font-bold text-lg transform -rotate-45 ${
                  isScrolled ? "text-zinc-900" : "text-white"
                }`}
              >
                G
              </span>
            </div>
            <span
              className={`font-serif text-xl tracking-widest uppercase ${
                isScrolled ? "text-zinc-900" : "text-white"
              }`}
            >
              Griya<span className="font-light">Persada</span>
            </span>
          </div>

          <div className="hidden md:flex space-x-10 items-center">
            {["Katalog", "Fasilitas", "Site Plan", "Lokasi", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className={`text-xs uppercase tracking-[0.2em] font-medium hover:text-amber-500 transition-colors ${
                  isScrolled ? "text-zinc-600" : "text-zinc-300"
                }`}
              >
                {item}
              </a>
            ))}
            <a
              href="#vip"
              className="relative overflow-hidden group px-6 py-3 bg-zinc-900 text-white text-xs uppercase tracking-widest font-medium rounded-sm hover:bg-zinc-800 transition-all"
            >
              <span className="relative z-10">VIP Access</span>
              <div className="absolute inset-0 h-full w-0 bg-amber-600 transition-all duration-500 ease-out group-hover:w-full z-0" />
            </a>
          </div>

          <button
            className="md:hidden text-amber-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 animate-[pulse_20s_ease-in-out_infinite] scale-105">
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=2400&q=80"
              alt="Dummy Foto Perumahan"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/40 to-zinc-950/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full mt-20 text-center flex flex-col items-center">
          <Reveal delay={100}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-amber-500" />
              <span className="text-amber-500 text-xs font-semibold tracking-[0.3em] uppercase">
                Private Residence
              </span>
              <div className="w-12 h-[1px] bg-amber-500" />
            </div>
          </Reveal>

          <Reveal delay={300}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white leading-[1.1] mb-8 tracking-tight">
              Elevasi Gaya Hidup <br />
              <span className="font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">
                Tanpa Batas.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={500}>
            <p className="text-lg md:text-xl text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed mb-12">
              Koleksi hunian ultra-modern yang dirancang oleh arsitek ternama. Menyatu harmonis
              dengan alam, menghadirkan privasi absolut untuk Anda.
            </p>
          </Reveal>

          <Reveal delay={700}>
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="#katalog"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-amber-600 text-white font-medium text-sm uppercase tracking-widest hover:bg-amber-500 transition-colors rounded-sm"
              >
                Eksplorasi Koleksi
                <ArrowRight
                  size={16}
                  className="transform group-hover:translate-x-2 transition-transform duration-300"
                />
              </a>
              <a
                href="#video"
                className="group flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-medium text-sm uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-colors rounded-sm backdrop-blur-sm"
              >
                <Play size={16} className="fill-current" /> Tonton Video
              </a>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-70 z-10">
          <span className="text-[10px] text-white uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="bg-white/80 backdrop-blur-2xl shadow-2xl shadow-zinc-900/10 border border-zinc-100 rounded-sm p-8 flex flex-col md:flex-row justify-around items-center gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
            <div className="text-center px-8">
              <p className="text-4xl font-serif text-zinc-900 mb-2">
                15<span className="text-amber-600">+</span>
              </p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
                Hektar Area Hijau
              </p>
            </div>
            <div className="text-center px-8">
              <p className="text-4xl font-serif text-zinc-900 mb-2">50</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
                Unit Eksklusif
              </p>
            </div>
            <div className="text-center px-8">
              <p className="text-4xl font-serif text-zinc-900 mb-2">
                24<span className="text-amber-600">/</span>7
              </p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
                Layanan Concierge
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="fasilitas" className="py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal direction="left">
                <h2 className="text-xs text-amber-600 font-bold uppercase tracking-[0.3em] mb-4">
                  Gaya Hidup Premium
                </h2>
                <h3 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-8 leading-tight">
                  Fasilitas Bintang Lima <br />di Depan Pintu Anda.
                </h3>
                <p className="text-zinc-600 text-lg font-light leading-relaxed mb-12">
                  Setiap detail di Griya Persada dirancang untuk memanjakan residen. Mulai dari
                  sistem rumah pintar terpadu hingga clubhouse eksklusif bergaya resor.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <Shield className="text-amber-600 w-8 h-8 stroke-[1.5]" />
                    <h4 className="text-zinc-900 font-medium">Smart Security</h4>
                    <p className="text-sm text-zinc-500">Akses biometrik dan CCTV analitik 24 jam.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Star className="text-amber-600 w-8 h-8 stroke-[1.5]" />
                    <h4 className="text-zinc-900 font-medium">Private Clubhouse</h4>
                    <p className="text-sm text-zinc-500">
                      Fasilitas lounge, pool, dan gym berstandar internasional.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <TreePine className="text-amber-600 w-8 h-8 stroke-[1.5]" />
                    <h4 className="text-zinc-900 font-medium">Botanical Garden</h4>
                    <p className="text-sm text-zinc-500">Taman tematik seluas 2 hektar untuk relaksasi.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Car className="text-amber-600 w-8 h-8 stroke-[1.5]" />
                    <h4 className="text-zinc-900 font-medium">Underground Utility</h4>
                    <p className="text-sm text-zinc-500">
                      Infrastruktur listrik dan fiber optik bawah tanah rapi.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="relative h-[600px]">
              <Reveal direction="right" delay={200}>
                <img
                  src="https://images.unsplash.com/photo-1576013551627-c020e556f8f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                  alt="Clubhouse"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm shadow-2xl"
                />
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-zinc-900 p-8 flex flex-col justify-center rounded-sm">
                  <span className="text-amber-500 text-5xl font-serif mb-2">#1</span>
                  <span className="text-white text-sm uppercase tracking-widest">
                    Penghargaan Desain Resor
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="katalog" className="py-32 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-xs text-amber-600 font-bold uppercase tracking-[0.3em] mb-4">
                  Koleksi Terbatas
                </h2>
                <h3 className="text-4xl md:text-5xl font-serif text-zinc-900 leading-tight">
                  Mahakarya Arsitektur <br />untuk Warisan Anda.
                </h3>
              </div>
              <a
                href="#kontak"
                className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900 border-b-2 border-zinc-900 pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors"
              >
                Unduh E-Brosur <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <Reveal delay={100}>
              <div className="group cursor-pointer">
                <div className="relative h-[500px] overflow-hidden rounded-sm mb-6">
                  <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="The Astoria"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute top-6 left-6 z-20">
                    <span className="bg-zinc-900 text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-sm backdrop-blur-md">
                      Tipe Signature
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-3xl font-serif text-zinc-900 mb-2">The Astoria</h4>
                    <p className="text-zinc-500 font-light mb-4 text-sm">
                      Luas Bangunan 150m² • Luas Tanah 200m²
                    </p>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-2 text-zinc-900 text-sm font-medium">
                        <Home size={16} className="text-amber-600" /> 4 BR
                      </span>
                      <span className="flex items-center gap-2 text-zinc-900 text-sm font-medium">
                        <Car size={16} className="text-amber-600" /> 2 Garasi
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Mulai Dari</p>
                    <p className="text-2xl font-serif text-amber-600">Rp 2.8 M</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300} direction="up">
              <div className="group cursor-pointer md:mt-24">
                <div className="relative h-[500px] overflow-hidden rounded-sm mb-6">
                  <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="The Bvlgari"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute top-6 left-6 z-20">
                    <span className="bg-amber-600 text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-sm backdrop-blur-md">
                      Paling Diminati
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-3xl font-serif text-zinc-900 mb-2">The Bvlgari</h4>
                    <p className="text-zinc-500 font-light mb-4 text-sm">
                      Luas Bangunan 210m² • Luas Tanah 250m²
                    </p>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-2 text-zinc-900 text-sm font-medium">
                        <Home size={16} className="text-amber-600" /> 5 BR
                      </span>
                      <span className="flex items-center gap-2 text-zinc-900 text-sm font-medium">
                        <Car size={16} className="text-amber-600" /> 3 Garasi + Pool
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Mulai Dari</p>
                    <p className="text-2xl font-serif text-amber-600">Rp 4.5 M</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="siteplan" className="py-32 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/3">
              <Reveal>
                <div className="inline-flex items-center gap-3 px-4 py-2 border border-zinc-800 bg-zinc-900/50 rounded-sm mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-zinc-300 text-[10px] uppercase tracking-widest">
                    Sistem Sinkronisasi Aktif
                  </span>
                </div>
                <h3 className="text-4xl font-serif text-white mb-6">Peta Digital Kavling</h3>
                <p className="text-zinc-400 text-lg font-light mb-10 leading-relaxed">
                  Tinjau ketersediaan unit impian Anda. Terhubung secara eksklusif dengan
                  *database* manajemen kami, memberikan Anda informasi yang presisi dan transparan
                  di detik ini juga.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center rounded-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    </div>
                    <div>
                      <p className="text-white text-sm uppercase tracking-widest">Tersedia</p>
                      <p className="text-zinc-500 text-xs font-light">Unit siap untuk diakuisisi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-amber-500/30 bg-amber-500/10 flex items-center justify-center rounded-sm">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                    </div>
                    <div>
                      <p className="text-white text-sm uppercase tracking-widest">Reserved</p>
                      <p className="text-zinc-500 text-xs font-light">
                        Sedang dalam proses legalisasi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-zinc-800 bg-zinc-900 flex items-center justify-center rounded-sm opacity-50">
                      <div className="w-2 h-2 rounded-full bg-zinc-600" />
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm uppercase tracking-widest">Sold Out</p>
                      <p className="text-zinc-600 text-xs font-light">Unit telah memiliki tuan</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:w-2/3 w-full md:perspective-[1800px]">
              <Reveal delay={300} direction="left">
                <div className="relative transition-all duration-[1000ms] ease-out drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:transform-gpu md:hover:rotate-x-[4deg] md:hover:rotate-z-[-1.5deg]">
                  <div className="grid grid-cols-4 gap-4 p-8 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-lg">
                    {[
                      { id: "BLK-A1", status: "sold" },
                      { id: "BLK-A2", status: "available" },
                      { id: "BLK-A3", status: "available" },
                      { id: "BLK-A4", status: "booked" },
                      { id: "BLK-B1", status: "sold" },
                      { id: "BLK-B2", status: "sold" },
                      { id: "BLK-B3", status: "available" },
                      { id: "BLK-B4", status: "available" },
                      { id: "BLK-C1", status: "available" },
                      { id: "BLK-C2", status: "booked" },
                      { id: "BLK-C3", status: "sold" },
                      { id: "BLK-C4", status: "available" },
                    ].map((kavling) => (
                      <div
                        key={kavling.id}
                        onMouseEnter={() =>
                          kavling.status === "available" && setActiveKavling(kavling.id)
                        }
                        onMouseLeave={() => setActiveKavling(null)}
                        className={`aspect-[4/3] flex flex-col items-center justify-center font-mono text-sm transition-all duration-500 relative cursor-pointer
                          ${
                            kavling.status === "available"
                              ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-900/60 hover:-translate-y-4 hover:shadow-[0_20px_30px_rgba(16,185,129,0.2)]"
                              : ""
                          }
                          ${
                            kavling.status === "booked"
                              ? "bg-amber-950/40 text-amber-500 border border-amber-500/30"
                              : ""
                          }
                          ${
                            kavling.status === "sold"
                              ? "bg-zinc-900 text-zinc-700 border border-zinc-800 opacity-40"
                              : ""
                          }
                        `}
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {kavling.status === "available" && activeKavling === kavling.id && (
                          <div className="absolute inset-0 bg-emerald-800/20 border border-emerald-500/20 transform translate-y-full -skew-x-12 opacity-50 blur-sm" />
                        )}

                        <span className="font-semibold">{kavling.id}</span>
                        {kavling.status === "available" && (
                          <span className="text-[9px] mt-1 opacity-70">TIPE ASTORIA</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="absolute -bottom-8 left-0 w-full h-16 border-t-2 border-dashed border-zinc-700 opacity-50" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="lokasi" className="py-32 bg-[#FAFAFA] border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div>
              <h2 className="text-xs text-amber-600 font-bold uppercase tracking-[0.3em] mb-4">
                Lokasi Strategis
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-8 leading-tight">
                Semua Kebutuhan Dekat, <br />Akses Tetap Privat.
              </h3>
              <p className="text-zinc-600 text-lg font-light leading-relaxed mb-10">
                Preview lokasi ini masih dummy untuk kebutuhan presentasi frontend. Nanti akan
                diganti ke data titik koordinat proyek yang aktual.
              </p>

              <div className="space-y-5">
                {[
                  "12 menit ke pusat kota Padang",
                  "8 menit ke akses tol terdekat",
                  "10 menit ke RS dan sekolah unggulan",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-zinc-700">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <p className="font-light">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200} direction="left">
            <div className="relative h-[420px] rounded-sm overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-900/10">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80"
                alt="Preview Peta Lokasi Perumahan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/55 to-zinc-950/10" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border border-zinc-200 rounded-sm p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-1">
                    Titik Dummy Lokasi
                  </p>
                  <p className="text-zinc-900 font-medium">Jl. Bypass Baru, Padang Timur</p>
                </div>
                <button className="px-4 py-2 bg-zinc-900 text-white text-xs uppercase tracking-wider rounded-sm">
                  Lihat Rute
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
              <div>
                <h2 className="text-xs text-amber-600 font-bold uppercase tracking-[0.3em] mb-4">
                  Progress Pembangunan
                </h2>
                <h3 className="text-4xl md:text-5xl font-serif text-zinc-900 leading-tight">
                  Timeline Proyek <br />Versi Preview.
                </h3>
              </div>
              <p className="text-zinc-500 max-w-md font-light">
                Seluruh isi pada section ini masih dummy hardcode sebagai acuan visual halaman
                publik untuk tim marketing dan stakeholder.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((item, idx) => (
              <Reveal key={item.title} delay={idx * 150}>
                <article className="border border-zinc-200 rounded-sm p-7 bg-[#FCFCFC] hover:border-amber-400 transition-colors h-full">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-4">{item.phase}</p>
                  <h4 className="text-xl font-serif text-zinc-900 mb-5 leading-snug">{item.title}</h4>
                  <span className="inline-block px-3 py-1.5 text-xs uppercase tracking-widest bg-amber-100 text-amber-800 rounded-sm">
                    {item.status}
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-28 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-xs text-amber-500 font-bold uppercase tracking-[0.3em] mb-4">
                FAQ Preview
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                Pertanyaan yang Sering Muncul
              </h3>
            </div>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <Reveal key={item.q} delay={idx * 120}>
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full text-left border border-zinc-800 bg-zinc-900/60 rounded-sm p-6 transition-colors hover:border-amber-600"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <p className="text-white font-medium text-lg">{item.q}</p>
                      <span className="text-amber-500 text-xl leading-none">{isOpen ? "-" : "+"}</span>
                    </div>
                    {isOpen && <p className="text-zinc-400 mt-4 leading-relaxed font-light">{item.a}</p>}
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="vip" className="py-32 bg-zinc-900 relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="bg-zinc-950 border border-zinc-800 p-10 md:p-16 rounded-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-amber-600" />

              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif text-white mb-4">Jadwalkan Kunjungan Pribadi</h3>
                <p className="text-zinc-400 font-light text-sm max-w-lg mx-auto">
                  Tinggalkan kontak Anda. *Lifestyle Consultant* kami akan menghubungi Anda untuk
                  mengatur sesi tinjauan lokasi (*Private Viewing*) secara eksklusif.
                </p>
              </div>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      className="peer w-full bg-transparent border-b border-zinc-700 text-white pb-2 focus:outline-none focus:border-amber-500 placeholder-transparent transition-colors"
                      placeholder="Nama Lengkap"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-0 -top-4 text-xs text-zinc-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-0 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-amber-500"
                    >
                      Nama Sesuai KTP
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      className="peer w-full bg-transparent border-b border-zinc-700 text-white pb-2 focus:outline-none focus:border-amber-500 placeholder-transparent transition-colors"
                      placeholder="Nomor Handphone"
                    />
                    <label
                      htmlFor="phone"
                      className="absolute left-0 -top-4 text-xs text-zinc-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-0 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-amber-500"
                    >
                      Nomor WhatsApp Aktif
                    </label>
                  </div>
                </div>

                <div className="relative mt-8">
                  <select className="w-full bg-transparent border-b border-zinc-700 text-white pb-2 focus:outline-none focus:border-amber-500 appearance-none font-light cursor-pointer">
                    <option className="bg-zinc-900 text-zinc-300">Minat Tipe Astoria (150/200)</option>
                    <option className="bg-zinc-900 text-zinc-300">Minat Tipe Bvlgari (210/250)</option>
                    <option className="bg-zinc-900 text-zinc-300">
                      Diskusi Langsung dengan Konsultan
                    </option>
                  </select>
                  <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none text-zinc-500">
                    ▼
                  </div>
                </div>

                <div className="pt-6">
                  <button className="w-full py-5 bg-amber-600 text-white text-sm font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors rounded-sm flex justify-center items-center gap-3 group">
                    Kirim Permohonan{" "}
                    <ChevronRight
                      size={18}
                      className="transform group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>

                <div className="flex items-start gap-3 mt-6 text-zinc-500 text-xs font-light">
                  <Check size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p>
                    Dengan menekan tombol di atas, Anda menyetujui kebijakan privasi kami dan
                    bersedia dihubungi oleh perwakilan sah Griya Persada.
                  </p>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 flex items-center justify-center border border-zinc-700 transform rotate-45">
                <span className="font-serif text-white transform -rotate-45">G</span>
              </div>
              <span className="font-serif text-white uppercase tracking-widest">Griya Persada</span>
            </div>
            <p className="text-sm font-light leading-relaxed mb-8 max-w-sm">
              Sistem Informasi Manajemen Properti Terintegrasi. Mengelola hunian eksklusif dengan
              presisi teknologi modern (ERP).
            </p>
            <div className="flex gap-3 text-xs font-light tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-amber-600" /> Padang, Indonesia
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Navigasi</h4>
            <ul className="space-y-4 text-sm font-light">
              <li>
                <a href="#katalog" className="hover:text-amber-500 transition-colors">
                  The Collection
                </a>
              </li>
              <li>
                <a href="#fasilitas" className="hover:text-amber-500 transition-colors">
                  Fasilitas Resor
                </a>
              </li>
              <li>
                <a href="#siteplan" className="hover:text-amber-500 transition-colors">
                  Peta Masterplan
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Head Office</h4>
            <ul className="space-y-4 text-sm font-light">
              <li>Jl. Jenderal Sudirman No. 88, Suite 12A</li>
              <li>Padang, Sumatera Barat 25111</li>
              <li className="pt-4 text-white">contact@griyapersada.co.id</li>
              <li className="text-white">+62 811 0000 9999</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light">
          <p>&copy; {new Date().getFullYear()} Griya Persada Development. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
