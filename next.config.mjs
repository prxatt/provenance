const nextConfig = {
  images: { unoptimized: true },
  turbopack: { root: import.meta.dirname },
  async rewrites() {
    const adminSegment = (process.env.ADMIN_PATH || '/_studio-provenance-private').replace(/^\//, '');
    if (adminSegment === 'studio-provenance-private') return [];
    return [
      { source: `/${adminSegment}`, destination: '/studio-provenance-private' },
      { source: `/${adminSegment}/:path*`, destination: '/studio-provenance-private/:path*' },
    ];
  },
};

export default nextConfig;
