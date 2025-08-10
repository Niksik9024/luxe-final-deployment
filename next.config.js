/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is to allow requests from the cloud development environment.
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
  // Webpack configuration to handle chunk loading issues
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  // Additional configuration for better chunk handling
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Output configuration
  output: 'standalone',
  // Disable static optimization for better development experience
  ...(process.env.NODE_ENV === 'development' && {
    staticPageGenerationTimeout: 1000,
  }),
};

module.exports = nextConfig;