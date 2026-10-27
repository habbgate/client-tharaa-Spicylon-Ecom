import Image from "next/image";
import { getLocale } from "next-intl/server";
import {
  CERTIFICATE_BODY,
  CERTIFICATE_DOCUMENTS,
  CERTIFICATE_VALID,
  CERTIFICATE_VERIFY_URL,
  INCORPORATION_DOCUMENT,
  MANUFACTURER_ADDRESS_LINES,
  MANUFACTURER_INCORPORATED,
  MANUFACTURER_NAME,
  MANUFACTURER_REGISTRATION,
  MANUFACTURER_SCOPE,
} from "@/lib/company";

export default async function Certifications({ compact = false }: { compact?: boolean }) {
  const de = (await getLocale()) === "de";
  const docs = Object.fromEntries(CERTIFICATE_DOCUMENTS.map(d => [d.key === "iso" ? "iso-22000" : d.key, d])) as Record<string, (typeof CERTIFICATE_DOCUMENTS)[number]>;
  const certifications = [
    { name: "ISO 22000:2018", description: de ? "Managementsystem für Lebensmittelsicherheit" : "Food Safety Management System", tone: "iso", image: "iso-22000" },
    { name: "GMP", description: de ? "Gute Herstellungspraxis" : "Good Manufacturing Practice", tone: "gmp", image: "gmp" },
    { name: "HACCP", description: de ? "Gefahrenanalyse und kritische Kontrollpunkte" : "Hazard Analysis and Critical Control Points", tone: "haccp", image: "haccp" },
  ];

  if (compact) return (
    <div className="certifications-compact">
      <h3>{de ? "Unsere Zertifizierungen" : "Our certifications"}</h3>
      <a href="/about#certifications" className="certifications-footer-link" aria-label={de ? "Unsere Zertifizierungen ansehen" : "View our certifications"}>
        {certifications.map(item => <Image key={item.name} src={`/certifications/${item.image}.png`} width={72} height={72} alt={`${item.name} certified`} />)}
      </a>
    </div>
  );

  return (
    <section className="certifications-section" aria-label={de ? "Zertifizierungen" : "Certifications"}>
      <div className="certifications-intro">
        <span className="shop-eyebrow">{de ? "ZERTIFIZIERTE LEBENSMITTELSICHERHEIT" : "CERTIFIED FOOD SAFETY"}</span>
        <h2>{de ? "Mit Sorgfalt. Mit Vertrauen." : "Handled with care. Certified with confidence."}</h2>
        <p>{de ? "Spicylon ist nach ISO 22000:2018, GMP und HACCP zertifiziert – für Lebensmittelsicherheit und sorgfältige Herstellung." : "Spicylon is ISO 22000:2018, GMP and HACCP certified, reflecting our commitment to food safety and careful manufacturing."}</p>
      </div>
      <div className="certifications-grid">
        {certifications.map(item => (
          <div key={item.name} className={`certification-card certification-${item.tone}`}>
            <Image className="certification-artwork" src={`/certifications/${item.image}.png`} width={180} height={180} sizes="(max-width: 640px) 120px, 180px" alt={`${item.name} certified seal`} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="certification-number">{de ? "Zertifikat Nr." : "Certificate No."} {docs[item.image].number}</p>
            <a className="certification-link" href={`/certifications/documents/${docs[item.image].file}.pdf`} target="_blank" rel="noopener noreferrer">{de ? "Zertifikat ansehen (PDF)" : "View certificate (PDF)"} ↗</a>
          </div>
        ))}
      </div>
      <div className="certifications-company">
        <h3>{MANUFACTURER_NAME}</h3>
        <p>{MANUFACTURER_ADDRESS_LINES.join(", ")}</p>
        <p>{MANUFACTURER_REGISTRATION} · {de ? "Gegründet am" : "Incorporated"} {MANUFACTURER_INCORPORATED} · <a href={INCORPORATION_DOCUMENT} target="_blank" rel="noopener noreferrer">{de ? "Handelsregisterauszug (PDF)" : "Certificate of incorporation (PDF)"} ↗</a></p>
        <p>{de ? "Geltungsbereich" : "Scope"}: {MANUFACTURER_SCOPE}.</p>
        <p>{de ? "Zertifiziert durch" : "Certified by"} {CERTIFICATE_BODY} · {de ? "gültig bis" : "valid until"} {CERTIFICATE_VALID.expires} · <a href={CERTIFICATE_VERIFY_URL} target="_blank" rel="noopener noreferrer">{de ? "Zertifikate prüfen auf" : "Verify at"} otabucert.com ↗</a></p>
      </div>
    </section>
  );
}
