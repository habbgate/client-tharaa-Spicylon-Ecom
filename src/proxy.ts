import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Check if lang and currency are already set
  const langCookie = request.cookies.get('lang');
  const currencyCookie = request.cookies.get('currency');

  if (!langCookie || !currencyCookie) {
    try {
      // In development, IP might be local, so we might need a fallback.
      // For real use, we use the client's IP. 
      // Next.js provides x-forwarded-for header.
      const ip = request.headers.get('x-forwarded-for') || '8.8.8.8'; // Fallback to 8.8.8.8 for testing
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoRes.json();

      const country = geoData.country_code;
      
      let lang = 'en';
      let currency = 'USD';

      if (country === 'DE' || country === 'CH' || country === 'AT') {
        lang = 'de';
        currency = 'EUR';
      } else if (country === 'LK') {
        currency = 'LKR';
      }

      if (!langCookie) {
        response.cookies.set('lang', lang, { path: '/' });
      }
      if (!currencyCookie) {
        response.cookies.set('currency', currency, { path: '/' });
      }
    } catch (error) {
      console.error('Middleware GeoIP error:', error);
      // Fallback
      if (!langCookie) response.cookies.set('lang', 'en', { path: '/' });
      if (!currencyCookie) response.cookies.set('currency', 'USD', { path: '/' });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
