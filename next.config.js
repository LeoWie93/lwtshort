const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src ${process.env.NEXT_PUBLIC_BASE_URL};
  style-src 'self' ${process.env.NEXT_PUBLIC_BASE_URL};
  font-src 'self';  
`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

const { PHASE_PRODUCTION_BUILD } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    securityHeaders.push({
      key: "Content-Security-Policy",
      value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
    });
  }

  return {
    reactStrictMode: true,
    swcMinify: true,
    async headers() {
      return [
        {
          source: "/:path*",
          headers: securityHeaders,
        },
      ];
    },
  };
};
