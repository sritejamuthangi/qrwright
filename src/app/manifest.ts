import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "QRWright", short_name: "QRWright", description: "Free QR codes and barcodes, made in your browser.", start_url: "/qr-code-generator", display: "standalone", background_color: "#f6f4ee", theme_color: "#0d0d0e", lang: "en", icons: [ { src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" } ] };
}
