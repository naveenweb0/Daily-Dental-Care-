import type { Metadata } from "next";
import { CLINIC } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Daily Dental Care collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-slate-600 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-[#0b2545]">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed">
        <p>This policy explains how {CLINIC.name} handles information submitted through this website.</p>
        <h2 className="text-lg font-semibold text-[#0b2545]">Information we collect</h2>
        <p>When you book an appointment or send an enquiry we collect your name, phone number, email address, age (optional), the treatment you are interested in and any message you write.</p>
        <h2 className="text-lg font-semibold text-[#0b2545]">How we use it</h2>
        <p>Your details are used only to schedule, confirm, reschedule or follow up on your dental appointment and enquiry. We do not sell your data.</p>
        <h2 className="text-lg font-semibold text-[#0b2545]">Medical information</h2>
        <p>Please do not submit detailed medical history through the website. Clinical information is recorded securely at the clinic.</p>
        <h2 className="text-lg font-semibold text-[#0b2545]">Storage and security</h2>
        <p>Data is stored in a secured database with restricted, role-based staff access and is retained only as long as necessary for clinic administration.</p>
        <h2 className="text-lg font-semibold text-[#0b2545]">Your choices</h2>
        <p>You can ask us to correct or delete your enquiry data by calling {CLINIC.phone} or writing to {CLINIC.email}.</p>
      </div>
    </div>
  );
}
