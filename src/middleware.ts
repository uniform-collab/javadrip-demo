import { NextRequest, NextResponse } from 'next/server';
import locales from '@/context/locales.json';

const NEXT_LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

// ToDo: the best place should be discussed
const COUNTRY_PRIORITY_LOCALES: Record<string, string> = {
  NL: 'nl-NL',
  DK: 'nl-NL',
  BE: 'nl-NL',
  DE: 'nl-NL',
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    '/(.*?trpc.*?|(?!static|.*\\..*|_next|images|img|api|favicon.ico).*)',
    '/',
  ],
};

export async function middleware(request: NextRequest) {
  const data = request.headers.get('x-nextjs-data');
  const previewDataCookie = request.cookies.get('__next_preview_data');
  const {
    nextUrl: { search },
  } = request;

  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  // disabling middleware in preview
  if (Boolean(previewDataCookie) || Boolean(data) || params.is_incontext_editing_mode === 'true') {
    return NextResponse.next();
  }

  const url = request.nextUrl;
  const queryParams = urlSearchParams.toString();

  // rewriting for insights
  const insightsHost = process.env.UNIFORM_INSIGHTS_ENDPOINT;
  const insightsApiKey = process.env.UNIFORM_INSIGHTS_KEY;
  if (insightsHost && insightsApiKey && url.pathname === '/v0/events') {
    const insightsPath = `${insightsHost}${url.pathname}?${queryParams}`;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${insightsApiKey}`);
    return NextResponse.rewrite(new URL(insightsPath), {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // locale redirection
  const currentLocale = request.cookies.get(NEXT_LOCALE_COOKIE_NAME)?.value;
  if (currentLocale && currentLocale !== url.locale) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}${url.pathname}${queryParams ? `?${queryParams}` : ''}`, request.url)
    );
  }

  const currentCountryCode = request.geo?.country;
  if (!currentLocale && currentCountryCode) {
    const recommendedLocale = currentCountryCode ? COUNTRY_PRIORITY_LOCALES[currentCountryCode] : undefined;
    const foundLocale =
      recommendedLocale && locales.locales.includes(recommendedLocale)
        ? recommendedLocale
        : locales.locales.find((locale: string) => locale.endsWith(currentCountryCode));
    if (foundLocale) {
      const newResponse = NextResponse.redirect(
        new URL(`/${foundLocale}${url.pathname}${queryParams ? `?${queryParams}` : ''}`, request.url)
      );
      newResponse.cookies.set(NEXT_LOCALE_COOKIE_NAME, foundLocale);
      return newResponse;
    }
  }

  return NextResponse.next();
}
