// next.config.js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://44.196.112.117:8080/api/:path*', // Go backend
      },
    ];
  },
};

export default nextConfig;
