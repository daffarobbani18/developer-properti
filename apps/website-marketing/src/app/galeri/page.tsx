import Image from "next/image";

import { galleryImages } from "../../lib/data";

export const metadata = {
  title: "Galeri"
};

export default function GaleriPage() {
  return (
    <section className="content-section">
      <div className="container">
        <header className="section-head">
          <h2>Galeri Kawasan dan Unit</h2>
          <p>Dokumentasi visual kawasan, interior, dan progres pembangunan unit.</p>
        </header>

        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <Image key={`${image}-${index}`} src={image} alt="Galeri Graha Mutiara" width={900} height={620} />
          ))}
        </div>
      </div>
    </section>
  );
}
