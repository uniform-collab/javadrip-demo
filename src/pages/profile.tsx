import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from '@uniformdev/canvas';
import { withUniformGetServerSideProps, prependLocale } from '@uniformdev/canvas-next/route';
import { getBreadcrumbs, getRouteClient } from '../utilities/canvas/canvasClients';
export { default } from '@/components/Page';
import localizationSettings from '@/context/locales.json';
// Doc: https://docs.uniform.app/docs/guides/composition/url-management/routing/slug-based-routing

const DISABLE_EXTRA_FEATURES = process.env.NEXT_PUBLIC_DISABLE_EXTRA_FEATURES === 'true';

export const getServerSideProps = withUniformGetServerSideProps({
  requestOptions: context => ({
    state: Boolean(context.preview) ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  }),
  modifyPath: prependLocale,
  client: getRouteClient(),
  handleComposition: async (routeResponse, _context) => {
    const { composition, errors } = routeResponse.compositionApiResponse || {};

    if (errors?.some(e => e.type === 'data' || e.type === 'binding')) {
      return { notFound: true };
    }

    const preview = Boolean(_context.preview);
    const breadcrumbs = DISABLE_EXTRA_FEATURES
      ? []
      : await getBreadcrumbs({
          compositionId: composition._id,
          preview,
          dynamicTitle: composition?.parameters?.pageTitle?.value as string,
          urlSegments: _context.resolvedUrl?.split('/'),
        });

    const translations = await import(`@/locales/${_context.locale || 'en-US'}.json`)
      .then(m => m.default)
      .catch(() => ({}));

    return {
      props: { preview, data: composition || null, context: { breadcrumbs }, localizationSettings, translations },
    };
  },
});
