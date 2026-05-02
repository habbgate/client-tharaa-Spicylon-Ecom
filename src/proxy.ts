import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Country → currency mapping (same logic as /api/currency)
const CHF_COUNTRIES = new Set(['CH', 'LI']);
const EUR_COUNTRIES = new Set([
  'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
  'AD', 'MC', 'SM', 'VA', 'ME', 'XK',
]);
const AED_COUNTRIES = new Set(['AE']);
const LKR_COUNTRIES = new Set(['LK']);

function getCurrency(country: string | null | undefined): string {
  if (!country) return 'USD';
  if (CHF_COUNTRIES.has(country)) return 'CHF';
  if (EUR_COUNTRIES.has(country)) return 'EUR';
  if (AED_COUNTRIES.has(country)) return 'AED';
  if (LKR_COUNTRIES.has(country)) return 'LKR';
  return 'USD';
}

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim().replace(/^::ffff:/, '');
    if (first && first !== '::1' && !first.startsWith('127.')) return first;
  }
  const real = request.headers.get('x-real-ip');
  if (real) {
    const clean = real.replace(/^::ffff:/, '');
    if (clean && clean !== '::1' && !clean.startsWith('127.')) return clean;
  }
  return '';
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const langCookie = request.cookies.get('lang');

  // --- Lang: set once and never change ---
  if (!langCookie) {
    response.cookies.set('lang', 'en', { path: '/', maxAge: 31536000 });
  }

  // --- Currency: always re-detect so VPN / travel changes take effect ---
  // Priority 1: Vercel geo header (free, no external call)
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  // Priority 2: Cloudflare
  const cfCountry = request.headers.get('cf-ipcountry');

  const headerCountry = vercelCountry || cfCountry;

  if (headerCountry) {
    // Instant server-side detection — no external API needed
    const currency = getCurrency(headerCountry);
    response.cookies.set('currency', currency, { path: '/', maxAge: 3600 });
    return response;
  }

  // Priority 3: ipapi.co lookup using real IP
  const ip = getIp(request);
  if (!ip) {
    // Localhost / dev — keep existing cookie or default USD
    if (!request.cookies.get('currency')) {
      response.cookies.set('currency', 'USD', { path: '/', maxAge: 3600 });
    }
    return response;
  }

  try {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, { cache: 'no-store' });
    const geoData = await geoRes.json();
    const currency = getCurrency(geoData.country_code);
    response.cookies.set('currency', currency, { path: '/', maxAge: 3600 });
  } catch {
    if (!request.cookies.get('currency')) {
      response.cookies.set('currency', 'USD', { path: '/', maxAge: 3600 });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
