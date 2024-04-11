import withPWAInit from "@ducanh2912/next-pwa";
import withBundleAnalyzer from "@next/bundle-analyzer";
import withMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs";
import { withAxiom } from "next-axiom";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
});

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    mdxRs: true,
  },

  headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

if (process.env.ANALYZE === "true") {
  nextConfig = withBundleAnalyzer(
    {
      openAnalyzer: true,
      enabled: true,
    },
    nextConfig,
  );
}

// https://nextjs.org/docs/app/api-reference/next-config-js/headers#content-security-policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://insights.k1ng.dev;
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  img-src 'self' data: https://avatars.githubusercontent.com https://*.googleusercontent.com;
  connect-src 'self' https://insights.k1ng.dev https://avatars.githubusercontent.com;
  worker-src 'self' blob:;
  child-src 'self' blob:;
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

export default withSentryConfig(
  withAxiom(withPWA(withMDX()(nextConfig))),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "adrian-srodon",
    project: "todo-list",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
