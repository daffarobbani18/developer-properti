"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight, ShieldCheck, TreePine, Car } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/public/projects/${projectId}`);
        if (res.ok) {
          const resData = await res.json();
          setProject(resData.data);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchProject();
  }, [projectId]);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">Memuat...</div>;
  }

  if (!project) {
    return <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">Proyek tidak ditemukan.</div>;
  }

  // Fungsi untuk mendapatkan warna berdasarkan svgPathId unit
  const getFillColor = (pathId: string) => {
    if (!project.units) return "rgba(63, 63, 70, 0.4)"; // Default empty (zinc-700)
    
    const unit = project.units.find((u: any) => u.svgPathId === pathId);
    if (!unit) return "rgba(63, 63, 70, 0.4)"; // Default

    switch (unit.statusPenjualan) {
      case "Tersedia":
        return "rgba(16, 185, 129, 0.8)"; // emerald-500
      case "Booked":
        return "rgba(245, 158, 11, 0.8)"; // amber-500
      case "Terjual":
        return "rgba(239, 68, 68, 0.8)"; // rose-500
      default:
        return "rgba(63, 63, 70, 0.4)";
    }
  };

  const getUnitInfo = (pathId: string) => {
    if (!project.units) return null;
    return project.units.find((u: any) => u.svgPathId === pathId);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900 selection:bg-amber-200 selection:text-amber-900">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={project.imageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=2400&q=80"}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/40 to-zinc-950/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <Link href="/" className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest mb-6 inline-block">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-6">
            {project.name}
          </h1>
          <p className="text-lg text-zinc-300 font-light flex items-center justify-center gap-2">
            <MapPin size={18} className="text-amber-500" /> {project.location}
          </p>
        </div>
      </section>

      {/* Info & Tipe Rumah */}
      <section className="py-20 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6">Tentang Proyek</h2>
            <div className="text-zinc-600 leading-relaxed max-w-3xl whitespace-pre-wrap">
              {project.description || "Sebuah mahakarya hunian eksklusif yang memadukan desain modern dengan keasrian alam. Dirancang khusus untuk Anda yang menghargai privasi dan kenyamanan bertaraf internasional."}
            </div>
          </div>

          <h2 className="text-3xl font-serif text-zinc-900 mb-8">Pilihan Tipe Unit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {project.propertyTypes && project.propertyTypes.length > 0 ? (
              project.propertyTypes.map((tipe: any) => (
                <div key={tipe.id} className="border border-zinc-200 rounded-sm overflow-hidden group">
                  <div className="h-60 overflow-hidden">
                    <img 
                      src={tipe.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={tipe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-zinc-900 mb-2">{tipe.name}</h3>
                    <p className="text-sm text-zinc-500 mb-4">LT: {tipe.luasTanah}m² • LB: {tipe.luasBangunan}m²</p>
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-100">
                      <span className="text-amber-600 font-bold">Rp {(tipe.basePrice / 1000000).toFixed(0)} Jt</span>
                      <Link href={`/proyek/${project.id}/tipe/${tipe.id}`} className="text-xs uppercase tracking-widest text-zinc-900 font-bold hover:text-amber-600 flex items-center gap-2">
                        Detail <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-sm">
                Belum ada tipe unit yang tersedia untuk proyek ini.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Site Plan */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-xs text-amber-600 font-bold uppercase tracking-[0.3em] mb-4">Site Plan</h2>
            <h3 className="text-4xl font-serif text-white">Peta Kavling Interaktif</h3>
            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
              Arahkan kursor ke kavling untuk melihat detail status ketersediaan secara real-time.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-3/4 bg-zinc-900 border border-zinc-800 rounded-sm p-8 overflow-x-auto relative">
              {/* Dummy Interactive SVG Map */}
              <svg viewBox="0 0 800 600" className="w-full h-auto min-w-[600px] drop-shadow-2xl">
                {/* Background Layout (Jalan, dll) */}
                <rect x="0" y="0" width="800" height="600" fill="#18181b" rx="8" />
                <path d="M 0 300 L 800 300" stroke="#3f3f46" strokeWidth="40" />
                <path d="M 400 0 L 400 600" stroke="#3f3f46" strokeWidth="40" />
                
                <text x="750" y="290" fill="#52525b" fontSize="12" fontWeight="bold">JALAN UTAMA</text>

                {/* SVG Kavlings (These IDs match the svgPathId in the database) */}
                <g className="kavling-group cursor-pointer transition-all hover:brightness-125">
                  <rect id="A-01" x="100" y="100" width="100" height="150" fill={getFillColor("A-01")} stroke="#fff" strokeWidth="2" rx="4" />
                  <text x="125" y="180" fill="#fff" fontSize="16" fontWeight="bold" pointerEvents="none">A-01</text>
                </g>

                <g className="kavling-group cursor-pointer transition-all hover:brightness-125">
                  <rect id="A-02" x="220" y="100" width="100" height="150" fill={getFillColor("A-02")} stroke="#fff" strokeWidth="2" rx="4" />
                  <text x="245" y="180" fill="#fff" fontSize="16" fontWeight="bold" pointerEvents="none">A-02</text>
                </g>

                <g className="kavling-group cursor-pointer transition-all hover:brightness-125">
                  <rect id="B-01" x="480" y="100" width="100" height="150" fill={getFillColor("B-01")} stroke="#fff" strokeWidth="2" rx="4" />
                  <text x="505" y="180" fill="#fff" fontSize="16" fontWeight="bold" pointerEvents="none">B-01</text>
                </g>
                
                <g className="kavling-group cursor-pointer transition-all hover:brightness-125">
                  <rect id="B-02" x="600" y="100" width="100" height="150" fill={getFillColor("B-02")} stroke="#fff" strokeWidth="2" rx="4" />
                  <text x="625" y="180" fill="#fff" fontSize="16" fontWeight="bold" pointerEvents="none">B-02</text>
                </g>

                <g className="kavling-group cursor-pointer transition-all hover:brightness-125">
                  <rect id="C-01" x="100" y="350" width="100" height="150" fill={getFillColor("C-01")} stroke="#fff" strokeWidth="2" rx="4" />
                  <text x="125" y="430" fill="#fff" fontSize="16" fontWeight="bold" pointerEvents="none">C-01</text>
                </g>
              </svg>
              
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white text-xs px-3 py-1 rounded">
                Simulasi SVG Mapping (A-01, A-02, B-01, B-02, C-01)
              </div>
            </div>

            <div className="w-full lg:w-1/4 flex flex-col gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-6">
                <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs border-b border-zinc-800 pb-2">Legenda</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-emerald-500 rounded-sm shadow-[0_0_10px_#10b981]" />
                    <span className="text-zinc-300 text-sm">Tersedia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-amber-500 rounded-sm shadow-[0_0_10px_#f59e0b]" />
                    <span className="text-zinc-300 text-sm">Booked</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-rose-500 rounded-sm shadow-[0_0_10px_#f43f5e]" />
                    <span className="text-zinc-300 text-sm">Terjual</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-zinc-700 rounded-sm" />
                    <span className="text-zinc-500 text-sm">Belum Rilis / Kosong</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
