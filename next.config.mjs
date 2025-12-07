/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mangapark.net',
      },
      {
        protocol: 'https',
        hostname: '*.mpvim.org',
      },
      { protocol: 'https', hostname: '*.mpfip.org' },
      { protocol: 'https', hostname: '*.mpizz.org' },
      { protocol: 'https', hostname: '*.mpmok.org' },
      { protocol: 'https', hostname: '*.mpqom.org' },
      { protocol: 'https', hostname: '*.mpqsc.org' },
      { protocol: 'https', hostname: '*.mprnm.org' },
      { protocol: 'https', hostname: '*.mpubn.org' },
      { protocol: 'https', hostname: '*.mpujj.org' },
      { protocol: 'https', hostname: '*.mpypl.org' },
       {
        protocol: 'https',
        hostname: '*.mangapark.net', // For cover images which might be on subdomains
      },
    ],
  },
};

export default nextConfig;
