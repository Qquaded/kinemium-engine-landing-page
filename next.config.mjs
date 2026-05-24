const repo = "kinemium-engine-landing-page"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
}

export default nextConfig