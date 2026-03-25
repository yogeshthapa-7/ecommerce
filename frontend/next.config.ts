import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img3.wallspic.com',
      },
      {
        protocol: 'https',
        hostname: 'media.gq-magazine.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'www.sneakerfiles.com',
      },
      {
        protocol: 'https',
        hostname: 'stuffmagazine.fr',
      },
      {
        protocol: 'https',
        hostname: 'www.nike.sa',
      },
      {
        protocol: 'https',
        hostname: 'images.footballfanatics.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mistertennis.com',
      },
      {
        protocol: 'https',
        hostname: 'media-www.atmosphere.ca',
      },
      {
        protocol: 'https',
        hostname: 'www.uberprints.com',
      },
      {
        protocol: 'https',
        hostname: 'static.ftshp.digital',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
