/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure images from data URLs work
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
}

module.exports = nextConfig
