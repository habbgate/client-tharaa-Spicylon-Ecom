import {
  COMPANY_ADDRESS_LINES,
  COMPANY_LEGAL,
  COMPANY_NAME,
  COMPANY_REGISTRATION,
  MANUFACTURER_ADDRESS_LINES,
  MANUFACTURER_NAME,
  MANUFACTURER_REGISTRATION,
} from "@/lib/company";

export default function CompanyAddress() {
  return (
    <span>
      {COMPANY_NAME} <br />
      {COMPANY_LEGAL}
      <br />
      {COMPANY_ADDRESS_LINES[0]}
      <br />
      {COMPANY_ADDRESS_LINES[1]}
      <br />
      <span className="text-sm text-stone-500">{COMPANY_REGISTRATION}</span>
      <br />
      <br />
      {MANUFACTURER_NAME}
      <br />
      {MANUFACTURER_ADDRESS_LINES[0]}
      <br />
      {MANUFACTURER_ADDRESS_LINES[1]}
      <br />
      <span className="text-sm text-stone-500">{MANUFACTURER_REGISTRATION}</span>
    </span>
  );
}
