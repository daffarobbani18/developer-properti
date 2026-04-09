import type { MetadataRoute } from "next";

const routes = ["", "/tipe-rumah", "/galeri", "/fasilitas", "/lokasi", "/simulasi-kpr", "/kontak"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://grahamutiara.example.com";

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8
  }));
}
