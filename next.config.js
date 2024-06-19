// This file was automatically added by edgio init.
// You should commit this file to source control.
const { withEdgio } = require('@edgio/next/config');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const localizationSettings = require('./src/context/locales.json');

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
    NEXT_PUBLIC_BUILD_TIMESTAMP: String(new Date().valueOf()),
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'img.uniform.global' }],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
  },
  i18n: {
    locales: localizationSettings?.locales,
    defaultLocale: localizationSettings?.defaultLocale,
    localeDetection: false,
  },
  async redirects() {
    const fileName = './src/context/redirects.json';
    try {
      return require(fileName);
    } catch (e) {
      console.info(`❎ Redirects file ${fileName} not found`);
      return [];
    }
  },
};

const _preEdgioExport = nextConfig;

module.exports = (phase, config) =>
  withEdgio({
    ..._preEdgioExport,
  });
