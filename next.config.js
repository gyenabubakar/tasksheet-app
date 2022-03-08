// const removeImports = require('next-remove-imports')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
  },
  cssModules: true,
  webpack: (config) => {
    // Important: return the modified config
    return {
      ...config,
      allowedHosts: 'all',
    };
  },
};

module.exports = nextConfig;
