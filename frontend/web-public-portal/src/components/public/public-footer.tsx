import Link from "next/link";
import { MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-14 md:py-16 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 flex items-center justify-center border border-zinc-700 transform rotate-45">
              <span className="font-serif text-white transform -rotate-45">G</span>
            </div>
            <span className="font-serif text-white uppercase tracking-widest">Griya Persada</span>
          </div>
          <p className="text-sm font-light leading-relaxed mb-8 max-w-sm">
            Sistem Informasi Manajemen Properti Terintegrasi. Mengelola hunian eksklusif dengan
            presisi teknologi modern.
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
              <Link href="/" className="hover:text-amber-500 transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/unit" className="hover:text-amber-500 transition-colors">
                Semua Unit
              </Link>
            </li>
            <li>
              <Link href="/lokasi" className="hover:text-amber-500 transition-colors">
                Lokasi
              </Link>
            </li>
            <li>
              <Link href="/kontak" className="hover:text-amber-500 transition-colors">
                Kontak
              </Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-12 md:mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light">
        <p>&copy; {new Date().getFullYear()} Griya Persada Development. Hak Cipta Dilindungi.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
