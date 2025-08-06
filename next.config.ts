
/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is to allow requests from the cloud development environment.
  allowedDevOrigins: ["*.cloudworkstations.dev"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;
