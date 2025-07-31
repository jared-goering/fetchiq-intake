/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
                 headers: [
           {
             key: 'Content-Security-Policy',
             value: "frame-ancestors *;",
           },
         ],
      },
    ]
  },
}

export default nextConfig
