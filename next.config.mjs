/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export for DreamHost / shared hosting
  output: "export",
  // Clean URLs as folders with index.html (works well on Apache)
  trailingSlash: true,
  images: {
    // next/image optimizer needs a server — disable for static hosts
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.studioromann.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
