/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 静的エクスポート用の設定
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // /appルートでReactアプリにリダイレクト
  async redirects() {
    return [
      {
        source: '/app',
        destination: 'http://localhost:3001',
        permanent: false,
      },
      {
        source: '/app/:path*',
        destination: 'http://localhost:3001/:path*',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
