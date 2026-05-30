"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight, X } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  // Lead Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:4000/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone,
          source: `Web Public - ${project?.name} - Kavling ${selectedUnit?.blok}-${selectedUnit?.nomor}`
        })
      });

      if (res.ok) {
        // Redirect to WhatsApp
        const waNumber = "6289501484655";
        const message = encodeURIComponent(`Halo, saya tertarik dengan Kavling Blok ${selectedUnit?.blok}-${selectedUnit?.nomor} di ${project?.name}. Bisakah saya mendapatkan info lebih lanjut?`);
        window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");
        
        setIsModalOpen(false);
        setLeadName("");
        setLeadPhone("");
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Group units by blok (same data as admin kavling-unit page)
  const units: any[] = project.units || [];
  const blocks = Array.from(new Set(units.map((u: any) => u.blok))).sort();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Tersedia": return "bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/40";
      case "Booked": return "bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/40";
      case "Terjual": return "bg-rose-500/20 border-rose-500 text-rose-300 hover:bg-rose-500/40 opacity-70";
      default: return "bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-zinc-700";
    }
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

      {/* Dynamic Unit Grid — data langsung dari kavling-unit */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden" onClick={() => setSelectedUnit(null)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-xs text-amber-600 font-bold uppercase tracking-[0.3em] mb-4">Site Plan</h2>
            <h3 className="text-4xl font-serif text-white">Ketersediaan Kavling</h3>
            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
              Klik salah satu kavling untuk melihat detail status dan informasi unitnya secara langsung.
            </p>
          </div>

          {units.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <MapPin size={48} className="mx-auto mb-4 opacity-30" />
              <p>Belum ada data kavling untuk proyek ini.</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Unit Grid */}
              <div className="w-full lg:w-3/4 space-y-10">
                {blocks.map((blok) => {
                  const blockUnits = units
                    .filter((u: any) => u.blok === blok)
                    .sort((a: any, b: any) => (parseInt(a.nomor) || 0) - (parseInt(b.nomor) || 0));
                  return (
                    <div key={blok}>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="h-px flex-1 bg-zinc-800" />
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full">
                          Blok {blok}
                        </span>
                        <div className="h-px flex-1 bg-zinc-800" />
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
                        {blockUnits.map((unit: any) => {
                          const isSelected = selectedUnit?.id === unit.id;
                          return (
                            <button
                              key={unit.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUnit(isSelected ? null : unit);
                              }}
                              className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border-2 text-center transition-all duration-200 hover:scale-110 hover:z-10 hover:shadow-lg focus:outline-none
                                ${getStatusStyle(unit.statusPenjualan)}
                                ${isSelected ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-950 scale-110 z-10 shadow-lg shadow-amber-500/20" : ""}
                              `}
                            >
                              <span className="text-[9px] font-semibold opacity-60 uppercase">{unit.blok}</span>
                              <span className="text-base font-black leading-none">{unit.nomor}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar: Detail + Legenda */}
              <div 
                className="w-full lg:w-1/4 flex flex-col gap-6 lg:sticky lg:top-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Detail Kavling Terpilih */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[220px]">
                  <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs border-b border-zinc-800 pb-3">Detail Kavling</h4>
                  {selectedUnit ? (
                    <div key={selectedUnit.id}>
                      <div className="flex items-center gap-3 mb-5">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          selectedUnit.statusPenjualan === "Tersedia" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" :
                          selectedUnit.statusPenjualan === "Booked" ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" :
                          selectedUnit.statusPenjualan === "Terjual" ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" : "bg-zinc-600"
                        }`} />
                        <span className="text-white font-bold text-lg leading-tight">
                          {selectedUnit.kawasan}<br/>
                          <span className="text-amber-400">Blok {selectedUnit.blok}-{selectedUnit.nomor}</span>
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-zinc-500 text-sm">Status</span>
                          <span className={`text-sm font-bold ${
                            selectedUnit.statusPenjualan === "Tersedia" ? "text-emerald-400" :
                            selectedUnit.statusPenjualan === "Booked" ? "text-amber-400" :
                            selectedUnit.statusPenjualan === "Terjual" ? "text-rose-400" : "text-zinc-400"
                          }`}>{selectedUnit.statusPenjualan}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-zinc-500 text-sm">Tipe Unit</span>
                          <span className="text-zinc-300 text-sm font-semibold text-right">
                            {project.propertyTypes?.find((t: any) => t.id === selectedUnit.propertyTypeId)?.name || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between pb-2">
                          <span className="text-zinc-500 text-sm">Harga</span>
                          <span className="text-amber-400 text-sm font-bold">
                            {(() => {
                              const type = project.propertyTypes?.find((t: any) => t.id === selectedUnit.propertyTypeId);
                              if (!type) return "-";
                              const total = (type.basePrice || 0) + (selectedUnit.priceMarkup || 0);
                              return `Rp ${(total / 1000000).toFixed(0)} Jt`;
                            })()}
                          </span>
                        </div>
                      </div>

                      {selectedUnit.statusPenjualan === "Tersedia" && selectedUnit.propertyTypeId ? (
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/proyek/${project.id}/tipe/${selectedUnit.propertyTypeId}`}
                            className="w-full block text-center bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                          >
                            Lihat Detail Tipe
                          </Link>
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full block text-center bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                          >
                            Pesan Kavling Ini →
                          </button>
                        </div>
                      ) : selectedUnit.statusPenjualan === "Tersedia" && !selectedUnit.propertyTypeId ? (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="w-full block text-center bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          Pesan Kavling Ini →
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600 py-8">
                      <MapPin size={32} className="mb-3 opacity-30" />
                      <p className="text-sm text-center leading-relaxed">Klik salah satu kavling untuk melihat detail</p>
                    </div>
                  )}
                </div>

                {/* Legenda */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs border-b border-zinc-800 pb-3">Legenda</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      <span className="text-zinc-300 text-sm">Tersedia</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                      <span className="text-zinc-300 text-sm">Booked</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                      <span className="text-zinc-300 text-sm">Terjual</span>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Total Kavling</span>
                      <span className="text-white font-bold">{units.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-500">Tersedia</span>
                      <span className="text-emerald-400 font-bold">{units.filter((u: any) => u.statusPenjualan === "Tersedia").length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-500">Booked</span>
                      <span className="text-amber-400 font-bold">{units.filter((u: any) => u.statusPenjualan === "Booked").length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-rose-500">Terjual</span>
                      <span className="text-rose-400 font-bold">{units.filter((u: any) => u.statusPenjualan === "Terjual").length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lead Generation Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm transition-opacity animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute right-6 top-6 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-serif font-bold text-zinc-900 mb-2">Pesan Kavling {selectedUnit?.blok}-{selectedUnit?.nomor}</h3>
            <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
              Tinggalkan kontak Anda, dan Anda akan langsung terhubung ke WhatsApp representatif penjualan kami.
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  placeholder="Misal: Budi Santoso"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nomor WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  placeholder="Misal: 08123456789"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white disabled:bg-zinc-300 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors mt-4 flex justify-center items-center gap-2"
              >
                {isSubmitting ? "Memproses..." : "Lanjut ke WhatsApp"} <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
