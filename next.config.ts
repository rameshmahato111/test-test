import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,


  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow GTM scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://cdn.jsdelivr.net https://api.mapbox.com https://*.mapbox.com https://www.googletagmanager.com",
              // Styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com https://*.mapbox.com",
              // Images
              "img-src 'self' data: blob: http://*.hotelbeds.com https://*.hotelbeds.com http://photos.hotelbeds.com https://photos.hotelbeds.com https://* https://images.unsplash.com https://*.mapbox.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // API and other connections
              "connect-src 'self' https://*.amazonaws.com https://* wss://* https://api.mapbox.com https://*.mapbox.com https://events.mapbox.com https://exploreden.com.au",
              // Media
              "media-src 'self'",
              // Object sources
              "object-src 'none'",
              // Frame sources
              "frame-src 'self'",
              // Form actions
              "form-action 'self'",
              // Base URI
              "base-uri 'self'",
              // Manifest
              "manifest-src 'self'",
              // Worker sources
              "worker-src 'self' blob: https://*.mapbox.com",
              // Frame ancestors
              "frame-ancestors 'none'",
              // Child sources
              "child-src blob:"
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      }
    ];
  },
 
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: "photos.hotelbeds.com",
      },
      {
        protocol: 'https',
        hostname: "maps.googleapis.com",
      },
      {
        protocol: 'https',
        hostname: "photos.hotelbeds.com",
      },
      {
        hostname: "api.booking.com",
      },
      {
        hostname: "media.activitiesbank.com",
      },
      {
        hostname: "exploreden-back-django-static.s3.ap-southeast-2.amazonaws.com",
      },
      { hostname: "cdn.worldota.net" },
      { protocol: 'https', hostname: 'api-v2.exploreden.com' },
    ],
  },
};

export default nextConfig;
