import type { Metadata } from "next";
import { CLINIC } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of use for the Daily Dental Care website and online appointment requests.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-slate-600 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-[#0b2545]">Terms &amp; Conditions</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-[#0b2545]">Website content</h2>
        <p>Information on this website is general in nature and is not a substitute for a clinical examination, diagnosis or professional dental advice.</p>
        <h2 className="text-lg font-semibold text-[#0b2545]">Appointment requests</h2>
        <p>An online booking creates an appointment request with a unique appointment ID. The clinic confirms the final slot and may contact you if a change is required.</p>
        <h2 className="text-lg font-semibold text-[#0b2545]">Cancellations</h2>
        <p>Please inform the clinic as early as possible if you cannot attend so the slot can be offered to another patient.</p>
        <h2 className="text-lg font-semibold text-[#0b2545]">Fees</h2>
        <p>Treatment fees depend on the clinical requirement and are shared after examination. No pricing shown on this website is a binding quotation.</p>
        <h2 className="text-lg font-semibold text-[#0b2545]">Contact</h2>
        <p>{CLINIC.name}, {CLINIC.address}. Phone: {CLINIC.phone}.</p>
      </div>
    </div>
  );
}
