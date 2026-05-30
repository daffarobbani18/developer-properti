"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Home, Bath, Bed, Check, ArrowRight } from "lucide-react";

export default function PropertyTypeDetailPage() {
  const params = useParams();
  const projectId = params.projectId;
  const tipeId = params.tipeId;
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

  const tipe = project.propertyTypes?.find((t: any) => t.id === tipeId);
  
  if (!tipe) {
    return <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">Tipe unit tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900">
      
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={tipe.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"}
            alt={tipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/40 to-zinc-950/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <Link href={`/proyek/${projectId}`} className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest mb-6 inline-block">
            ← Kembali ke {project.name}
          </Link>
          <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-6">
            Tipe {tipe.name}
          </h1>
          <p className="text-lg text-zinc-300 font-light max-w-2xl mx-auto">
            Hunian eksklusif dengan luas tanah {tipe.luasTanah}m² dan luas bangunan {tipe.luasBangunan}m².
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
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
                  <p className="mt-4 text-xs italic text-zinc-400">
                    *Fasilitas dikelola oleh admin inventory
                  </p>
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
              <div className="bg-zinc-900 text-white rounded-sm p-8 sticky top-32 shadow-2xl">
                <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Estimasi Harga Mulai</p>
                <p className="text-3xl font-serif font-bold text-amber-500 mb-8">
                  Rp {(tipe.basePrice / 1000000).toFixed(0)} Juta
                </p>

                <a 
                  href="https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20Tipe%20Rumah%20di%20Griya%20Persada" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-500 text-white py-4 font-bold uppercase tracking-widest text-xs transition-colors rounded-sm"
                >
                  Minta Penawaran VIP <ArrowRight size={16} />
                </a>
                
                <p className="text-xs text-zinc-500 text-center mt-4">
                  Tim kami akan menghubungi Anda untuk penawaran eksklusif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
