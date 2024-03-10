const withPWA = require("next-pwa");

/** @type {import('next').NextConfig} */
const nextConfig = {
  ignoreBuildErrors: true,
  baseUrl: "src",
  reactStrictMode: false,
  trailingSlash: true,
  // images: {
  //   loader: "akamai",
  //   path:
  //     process.env.NODE_ENV == "development"
  //       ? "http://localhost:3000"
  //       : "https://clinic-api.qafilaty.com/graphql",
  // },
  // pwa: {
  //   dest: "public",
  //   register: true,
  //   skipWaiting: true,
  //   disable: process.env.NODE_ENV === "development",
  // },
};

// module.exports = withPWA(nextConfig);

module.exports = nextConfig;

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// module.exports = withBundleAnalyzer({});
