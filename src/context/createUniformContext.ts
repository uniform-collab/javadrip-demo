import { NextPageContext } from 'next';
import {
  Context,
  ManifestV2,
  ContextPlugin,
  enableDebugConsoleLogDrain,
  enableContextDevTools,
} from '@uniformdev/context';
import { NextCookieTransitionDataStore } from '@uniformdev/context-next';
import { enableGoogleGtagAnalytics } from '@uniformdev/context-gtag';

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export default function createUniformContext(manifest: ManifestV2, serverContext?: NextPageContext): Context {
  const plugins: ContextPlugin[] = [enableContextDevTools(), enableDebugConsoleLogDrain('debug')];
  // Docs: https://docs.uniform.app/integrations/data/google-analytics#activate-ga-plugin
  if (googleAnalyticsId) plugins.push(enableGoogleGtagAnalytics({ emitAll: true }));

  return new Context({
    defaultConsent: true,
    manifest,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext,
    }),
    plugins: plugins,
  });
}
