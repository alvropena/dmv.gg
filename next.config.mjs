/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        has: [
          {
            type: 'host',
            value: 'dmv.gg',
          },
        ],
        destination: 'https://admin.dmv.gg/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.dmv.gg',
          },
        ],
        destination: '/api/:path*',
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.dmv.gg',
          },
        ],
        destination: '/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
