/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.google.com', 'github.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    HAS_GITHUB_TOKEN: !!process.env.GITHUB_API_TOKEN
  },
}

module.exports = nextConfig; 
