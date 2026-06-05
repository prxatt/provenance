const adminSegment = (process.env.ADMIN_PATH || '/_studio-provenance-private').replace(/^\//, '').replace(/\/$/, '');

const studioNoIndex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }];

const nextConfig = {
  images: { unoptimized: true },
  turbopack: { root: import.meta.dirname },
  async headers() {
    const rules = [
      { source: '/studio-provenance-private', headers: studioNoIndex },
      { source: '/studio-provenance-private/:path*', headers: studioNoIndex },
    ];
    if (adminSegment && adminSegment !== 'studio-provenance-private') {
      rules.push(
        { source: `/${adminSegment}`, headers: studioNoIndex },
        { source: `/${adminSegment}/:path*`, headers: studioNoIndex },
      );
    }
    return rules;
  },
  async rewrites() {
    if (adminSegment === 'studio-provenance-private') return [];
    return [
      { source: `/${adminSegment}`, destination: '/studio-provenance-private' },
      { source: `/${adminSegment}/:path*`, destination: '/studio-provenance-private/:path*' },
    ];
  },
};

export default nextConfig;
