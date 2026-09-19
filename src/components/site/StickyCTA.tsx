import Link from "next/link";
import { CLINIC, waLink } from "@/lib/clinic";

export default function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-px border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <a href={`tel:${CLINIC.phoneDial}`} className="py-3 text-center text-xs font-semibold text-slate-700">📞 Call</a>
      <a href={waLink("Hello Daily Dental Care, I would like to book an appointment.")} target="_blank" rel="noopener" className="py-3 text-center text-xs font-semibold text-emerald-700">💬 WhatsApp</a>
      <Link href="/book" className="bg-blue-700 py-3 text-center text-xs font-semibold text-white">📅 Book</Link>
    </div>
  );
}
