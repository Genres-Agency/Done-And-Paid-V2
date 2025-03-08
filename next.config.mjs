/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["via.placeholder.com"],
    unoptimized: true,
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
