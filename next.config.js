/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "userpic.codeforces.org",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Ignore optional drizzle-orm dependency in rate-limiter-flexible
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      'drizzle-orm': false,
    };
    return config;
  },
};

module.exports = nextConfig;
