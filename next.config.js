/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://mediflow-backend-r2c4.onrender.com/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;