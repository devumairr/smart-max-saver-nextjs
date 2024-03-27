/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  trailingSlash: true,
  distDir: "build",
    images: {
      loader: "custom",
      loaderFile: "./src/loader.ts",
        remotePatterns: [
          {
            protocol: "https",
            hostname: "images.konnektive.com",
            port: "",
            pathname: "/garnet_specialists_inc/**"
          }
        ]
    }
};

module.exports = nextConfig;
