import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The whole site is client-side, so it exports to plain files in out/ and can
  // be served by Cloudflare Pages without a server.
  output: 'export',
  images: { unoptimized: true },
}

export default nextConfig
