/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.google.com', 'github.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
