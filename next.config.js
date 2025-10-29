/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true
  },
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;
