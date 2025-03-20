const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack (config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'components'),
      '@app': path.resolve(__dirname, 'app'),
      '@': path.resolve(__dirname, '.')
    }
    return config
  }
  
}

module.exports = nextConfig
