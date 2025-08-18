/** @type {import('next').NextConfig} */
const nextConfig = {
 eslint: {
    ignoreDuringBuilds: true, // ignore ESLint errors during Vercel build
  },

  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com", pathname: "/**" },
      { protocol: "https", hostname: "gnews.io", pathname: "/**" },
      { protocol: "https", hostname: "www.iconpacks.net", pathname: "/icons/2/**" },
      { protocol: "https", hostname: "www.shutterstock.com", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
