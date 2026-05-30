"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Home, Bath, Bed, Check, ArrowRight, ArrowLeft, X } from "lucide-react";

export default function PropertyTypeDetailPage() {
  const params = useParams();
  const projectId = params.projectId;
  const tipeId = params.tipeId;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewerImage, setViewerImage] = useState<string | null>(null);

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

  const tipe = project.propertyTypes?.find((t: any) => t.id === tipeId);
  
  if (!tipe) {
    return <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">Tipe unit tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900">
      
      {/* Sleek Product Header */}
      <section className="pt-12 pb-8 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link href={`/proyek/${projectId}`} className="group flex items-center gap-2 text-zinc-500 hover:text-amber-600 text-xs uppercase tracking-widest font-bold mb-8 w-fit transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Kembali ke {project.name}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-zinc-900 mb-2">
                Tipe {tipe.name}
              </h1>
              <p className="text-lg text-zinc-500 font-light max-w-2xl">
                Hunian eksklusif di <span className="font-medium text-zinc-700">{project.name}</span>.
              </p>
            </div>
            <div className="text-left md:text-right border-l-4 border-amber-500 pl-4 md:border-none md:pl-0">
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Estimasi Harga Mulai</p>
              <p className="text-3xl font-serif font-bold text-amber-600">Rp {(tipe.basePrice / 1000000).toFixed(0)} Jt</p>
            </div>
          </div>

          <div 
            className="w-full h-[40vh] md:h-[60vh] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative group cursor-pointer"
            onClick={() => setViewerImage(tipe.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80")}
          >
            <img
              src={tipe.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"}
              alt={tipe.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Soft overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-white/90 backdrop-blur text-zinc-900 px-6 py-3 rounded-full text-sm font-bold shadow-xl">
                Lihat Foto Penuh
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-serif text-zinc-900 mb-6">Spesifikasi Unit</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded flex flex-col items-center justify-center text-center">
                  <Bed size={24} className="text-amber-600 mb-2" />
                  <span className="text-2xl font-serif font-bold text-zinc-900">{tipe.kamarTidur || tipe.bedrooms || 0}</span>
                  <span className="text-xs uppercase tracking-widest text-zinc-500">Kamar Tidur</span>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded flex flex-col items-center justify-center text-center">
                  <Bath size={24} className="text-amber-600 mb-2" />
                  <span className="text-2xl font-serif font-bold text-zinc-900">{tipe.kamarMandi || tipe.bathrooms || 0}</span>
                  <span className="text-xs uppercase tracking-widest text-zinc-500">Kamar Mandi</span>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded flex flex-col items-center justify-center text-center">
                  <Home size={24} className="text-amber-600 mb-2" />
                  <span className="text-2xl font-serif font-bold text-zinc-900">{tipe.luasBangunan}</span>
                  <span className="text-xs uppercase tracking-widest text-zinc-500">M² Luas Bgn</span>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded flex flex-col items-center justify-center text-center">
                  <Home size={24} className="text-amber-600 mb-2" />
                  <span className="text-2xl font-serif font-bold text-zinc-900">{tipe.luasTanah}</span>
                  <span className="text-xs uppercase tracking-widest text-zinc-500">M² Luas Tnh</span>
                </div>
              </div>

              <h2 className="text-3xl font-serif text-zinc-900 mb-6">Fasilitas & Keunggulan</h2>
              {tipe.facilities ? (
                <div>
                  <ul className="space-y-4 text-zinc-600">
                    {tipe.facilities.split('\n').filter((f: string) => f.trim().length > 0).map((fasilitas: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3"><Check size={18} className="text-emerald-500" /> {fasilitas.trim()}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className="space-y-4 text-zinc-600">
                  <li className="flex items-center gap-3"><Check size={18} className="text-emerald-500" /> Smart Home System Terintegrasi</li>
                  <li className="flex items-center gap-3"><Check size={18} className="text-emerald-500" /> Material Premium & Ramah Lingkungan</li>
                  <li className="flex items-center gap-3"><Check size={18} className="text-emerald-500" /> Instalasi Listrik & Fiber Optik Bawah Tanah</li>
                  <li className="flex items-center gap-3"><Check size={18} className="text-emerald-500" /> Desain Fasad Tropis Modern</li>
                </ul>
              )}
            </div>

            <div>
              <div className="bg-zinc-900 text-white rounded-[2rem] p-8 sticky top-8 shadow-2xl">
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Estimasi Harga Mulai</p>
                  <p className="text-4xl font-serif font-bold text-amber-500">
                    Rp {(tipe.basePrice / 1000000).toFixed(0)} <span className="text-xl">Juta</span>
                  </p>
                </div>

                <a 
                  href={`https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20Tipe%20${tipe.name}%20di%20${project.name}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-500 text-white py-4 font-bold uppercase tracking-widest text-xs transition-colors rounded-xl"
                >
                  Minta Penawaran VIP <ArrowRight size={16} />
                </a>
                
                <p className="text-xs text-zinc-500 text-center mt-6 leading-relaxed">
                  Tim kami akan menghubungi Anda untuk penawaran eksklusif dan tur virtual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Image Viewer */}
      {viewerImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/95 p-4 backdrop-blur-md transition-opacity animate-in fade-in"
          onClick={() => setViewerImage(null)}
        >
          <button 
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-rose-500 hover:text-white"
            onClick={(e) => { e.stopPropagation(); setViewerImage(null); }}
          >
            <X size={24} />
          </button>
          <img 
            src={viewerImage} 
            alt="Full screen viewer" 
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
}
