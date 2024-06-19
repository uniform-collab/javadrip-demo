/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from 'react';
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from '@uniformdev/canvas';
import { withUniformGetServerSideProps, prependLocale } from '@uniformdev/canvas-next/route';
import { getBreadcrumbs, getRouteClient } from '../utilities/canvas/canvasClients';
// @ts-ignore: It is assumed that each application implements the Page at the appropriate location
import Page, { PageProps } from '@/components/Page';
// @ts-ignore: It is assumed that each application implements the ProductDetailsPage at the appropriate location
import ProductDetailsPage from '@/components/ProductDetailsPage';
// @ts-ignore: It is assumed that each application implements the localeSettings json at the appropriate location
import localizationSettings from '@/context/locales.json';

const PRODUCT_DETAILS_PAGE_TYPE = 'productDetailsPage';
const DISABLE_EXTRA_FEATURES = process.env.NEXT_PUBLIC_DISABLE_EXTRA_FEATURES === 'true';

// Doc: https://docs.uniform.app/docs/guides/composition/url-management/routing/slug-based-routing

export const getServerSideProps = withUniformGetServerSideProps({
  requestOptions: context => ({
    state: Boolean(context.preview) ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  }),
  modifyPath: prependLocale,
  client: getRouteClient(),
  handleComposition: async (routeResponse, _context) => {
    const { locale, preview: previewParam, res, resolvedUrl } = _context || {};
    const { composition, errors } = routeResponse.compositionApiResponse || {};

    if (errors?.some(e => e.type === 'data' || e.type === 'binding')) {
      return { notFound: true };
    }

    const preview = Boolean(previewParam);
    const breadcrumbs = DISABLE_EXTRA_FEATURES
      ? []
      : await getBreadcrumbs({
          compositionId: composition._id,
          preview,
          dynamicTitle: composition?.parameters?.pageTitle?.value as string,
          urlSegments: resolvedUrl?.split('/'),
        });

    const translations = await import(`@/locales/${locale || 'en-US'}.json`).then(m => m.default).catch(() => ({}));

    // enable CDN caching of SSR pages by setting cache control
    // 7 days
    res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate=30');

    return {
      props: { preview, data: composition || null, context: { breadcrumbs }, localizationSettings, translations },
    };
  },
});

const PageResolver: FC<PageProps> = props =>
  props.data.type === PRODUCT_DETAILS_PAGE_TYPE ? <ProductDetailsPage {...props} /> : <Page {...props} />;

export default PageResolver;
