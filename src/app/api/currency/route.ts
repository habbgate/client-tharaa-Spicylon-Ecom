import { NextRequest, NextResponse } from 'next/server';

// Country code → currency mapping
const CHF_COUNTRIES = new Set(['CH', 'LI']);

const EUR_COUNTRIES = new Set([
  'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
  'AD', 'MC', 'SM', 'VA', 'ME', 'XK',
]);

// AED — UAE Dirham (United Arab Emirates)
const AED_COUNTRIES = new Set(['AE']);

const LKR_COUNTRIES = new Set(['LK']);

function getCurrencyFromCountry(countryCode: string): string {
  if (CHF_COUNTRIES.has(countryCode)) return 'CHF';
  if (EUR_COUNTRIES.has(countryCode)) return 'EUR';
  if (AED_COUNTRIES.has(countryCode)) return 'AED';
  if (LKR_COUNTRIES.has(countryCode)) return 'LKR';
  return 'USD';
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    // Strip IPv6-mapped IPv4 prefix (::ffff:x.x.x.x)
    const clean = firstIp.replace(/^::ffff:/, '');
    if (clean && clean !== '::1' && !clean.startsWith('127.')) return clean;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    const clean = realIp.replace(/^::ffff:/, '');
    if (clean && clean !== '::1' && !clean.startsWith('127.')) return clean;
  }
  // Next.js built-in IP (available on Vercel and some other hosts)
  const nextIp = (req as any).ip;
  if (nextIp) {
    const clean = nextIp.replace(/^::ffff:/, '');
    if (clean && clean !== '::1' && !clean.startsWith('127.')) return clean;
  }
  return '';
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);

  // Localhost / development: default to USD
  if (!ip) {
    return NextResponse.json({ currency: 'USD', country: null });
  }

  try {
    const geoRes = await fetch(
      `https://ip-api.com/json/${ip}?fields=status,countryCode`,
      { next: { revalidate: 3600 } }
    );
    if (!geoRes.ok) throw new Error('geo fetch failed');

    const geo = await geoRes.json();
    if (geo.status !== 'success' || !geo.countryCode) {
      return NextResponse.json({ currency: 'USD', country: null });
    }

    const currency = getCurrencyFromCountry(geo.countryCode);
    return NextResponse.json({ currency, country: geo.countryCode });
  } catch {
    return NextResponse.json({ currency: 'USD', country: null });
  }
}
