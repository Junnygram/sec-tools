import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: 'http://localhost:8080',
        destination: 'http://44.196.112.117',
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
