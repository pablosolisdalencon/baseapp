import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   /* config options here */
   eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'production' ? '' : "'unsafe-eval'"} https://res.cloudinary.com/;
              style-src 'self' 'unsafe-inline' https://res.cloudinary.com/;
              img-src 'self' https://res.cloudinary.com/ ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}.cloudinary.com/;
              font-src 'self' https://res.cloudinary.com/;
              connect-src 'self' https://api.cloudinary.com/ https://${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}.cloudinary.com/;
              object-src 'none';
              frame-ancestors 'self';
              
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
