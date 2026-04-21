/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const nextConfig = {
  reactCompiler: true,
  distDir: '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;