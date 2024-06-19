import React from 'react';
import Head from 'next/head';
import { RootComponentInstance } from '@uniformdev/canvas';
import { UniformContext } from '@uniformdev/context-react';
import { UniformAppProps } from '@uniformdev/context-next';
import { Asset } from '@uniformdev/assets';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import { LazyMotion, domAnimation } from 'framer-motion';
import createUniformContext from '@/context/createUniformContext';
import TrackersProvider, { GoogleAnalyticsGtag } from '../modules/google-analytics/TrackersProvider';
import '@/canvas';
import FakeCartContextProvider from '../modules/fake-cart/FakeCartProvider';
import { formatQuirksFormTraits } from '../modules/segment/utilities';
import SegmentDataContextProvider from '../modules/segment/SegmentDataProvider';
import UserProfileDataContextProvider from '../modules/auth/UserProfileDataProvider';
import { getManifestFromDOM, getMediaUrl } from '../utilities';
import '../styles/globals.scss';

export const App = ({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps<{
  segmentData?: SegmentProfile.SegmentData;
  profileData?: UserProfile.ProfileData;
  data: RootComponentInstance;
  context?: unknown;
  translations?: Record<string, string>;
}>) => {
  const router = useRouter();
  const { data: composition } = pageProps || {};
  const {
    pageTitle,
    pageMetaDescription,
    pageKeywords,
    openGraphTitle,
    openGraphDescription,
    openGraphImage,
    overlayTitleToOgImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    overlayTitleToTwitterImage,
    twitterCard,
  } = composition?.parameters || {};
  //This is workaround because spaces removes from query params and not parsing automatically.
  //Space should be encoded as %20 http://www.faqs.org/rfcs/rfc1738.html
  const ogTitle = (openGraphTitle?.value as string)?.replaceAll?.(' ', '%20');
  const twTitle = (twitterTitle?.value as string)?.replaceAll?.(' ', '%20');
  const title: string = pageTitle?.value as string;

  const compositionHeader = composition?.slots?.pageHeader?.[0];

  const favicon = compositionHeader?.parameters?.favicon?.value as Asset | undefined;
  const faviconHref = getMediaUrl(favicon);

  const openGraphImageSrc = getMediaUrl(openGraphImage?.value as Asset | undefined);
  const twitterImageSrc = getMediaUrl(twitterImage?.value as Asset | undefined);

  const renderOgImageElement = () => {
    if (overlayTitleToOgImage?.value && openGraphImageSrc) {
      return (
        <meta
          property="og:image"
          content={`/api/og?title=${ogTitle ?? title?.replaceAll?.(' ', '%20')}&image=${openGraphImageSrc}`}
        />
      );
    }
    if (openGraphImage?.value) return <meta property="og:image" content={openGraphImage?.value as string} />;
  };

  const renderTwitterImageElement = () => {
    if (overlayTitleToTwitterImage?.value && twitterImageSrc) {
      return (
        <meta
          property="twitter:image"
          content={`/api/og?title=${twTitle ?? title?.replaceAll?.(' ', '%20')}&image=${twitterImageSrc}`}
        />
      );
    }
    if (twitterImageSrc) return <meta property="twitter:image" content={twitterImageSrc} />;
  };

  const manifest = getManifestFromDOM();
  const clientContext = createUniformContext(manifest);

  const context = serverUniformContext ?? clientContext;
  const quirks = formatQuirksFormTraits(pageProps.segmentData?.traits);

  if (!!Object.keys(quirks).length) {
    context
      .update({
        quirks,
      })
      .then(() => console.info('The context has been updated based on the traits from Segment'))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => console.error(e));
  }

  return (
    <>
      <Head>
        {/* page metadata */}
        <title>{(pageTitle?.value as string) ?? 'Uniform Component Starter Kit'}</title>
        <meta name="description" content={pageMetaDescription?.value as string} />
        <meta name="keywords" content={pageKeywords?.value as string} />
        {/* Open Graph */}
        <meta property="og:title" content={(openGraphTitle?.value as string) ?? pageTitle?.value} />
        <meta
          property="og:description"
          content={(openGraphDescription?.value as string) ?? pageMetaDescription?.value}
        />
        {renderOgImageElement()}
        {/* Twitter */}
        <meta name="twitter:title" content={(twitterTitle?.value as string) ?? pageTitle?.value} />
        <meta name="twitter:card" content={(twitterCard?.value as string) ?? 'summary'} />
        <meta
          name="twitter:description"
          content={(twitterDescription?.value as string) ?? pageMetaDescription?.value}
        />
        {renderTwitterImageElement() as any} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
        {/* Other stuff */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="version" content={process.env.NEXT_PUBLIC_APP_VERSION} />
        {faviconHref && <link rel="shortcut icon" href={faviconHref} />}
        <GoogleAnalyticsGtag />
      </Head>
      <LazyMotion features={domAnimation}>
        <UniformContext context={context}>
          {/* FixMe: Think what timezone to use */}
          <NextIntlClientProvider
            locale={router.locale || 'en-US'}
            messages={pageProps.translations}
            timeZone="America/Chicago"
            onError={process.env.NODE_ENV !== 'development' ? () => null : undefined}
          >
            <SegmentDataContextProvider data={pageProps?.segmentData}>
              <UserProfileDataContextProvider data={pageProps?.profileData}>
                <Component {...pageProps} providers={FakeCartContextProvider} />
              </UserProfileDataContextProvider>
            </SegmentDataContextProvider>
            <TrackersProvider />
          </NextIntlClientProvider>
        </UniformContext>
      </LazyMotion>
    </>
  );
};

export default App;
