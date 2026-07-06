import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  // Ensure server-only packages don't get bundled in client
  serverExternalPackages: ['pg', 'drizzle-orm'],
};

export default nextConfig;
