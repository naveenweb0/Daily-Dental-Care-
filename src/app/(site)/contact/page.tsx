import type { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import { CLINIC, waLink } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Contact Daily Dental Care Mohali | Phase 7 Sector 61",
  description: "Call, WhatsApp or visit Daily Dental Care at Phase 7, Sector 61, Mohali (SAS Nagar), Punjab. Free parking & elevator access.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
          Reach Us
        </span>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Contact Our Mohali Dental Clinic
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Have a question about a dental procedure, need immediate toothache relief, or want to schedule an appointment? Our team is here to assist you.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        {/* Left Column: Contact Cards + Map */}
        <div className="space-y-6 lg:col-span-6">
          <div className="space-y-4 text-xs">
            {/* Address Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft">
              <span className="rounded-md bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-800">
                Clinic Location
              </span>
              <div className="mt-3 text-base font-bold text-slate-900">{CLINIC.name}</div>
              <div className="mt-1 text-slate-600 leading-relaxed">{CLINIC.address}</div>
              <div className="mt-3 flex items-center gap-2 text-emerald-700 font-semibold">
                <span>🚗 Ample Ground Parking &amp; Elevator Available</span>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 flex flex-wrap gap-2">
                <a
                  href={CLINIC.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  📍 Open in Google Maps
                </a>
              </div>
            </div>

            {/* Quick Contact Dual Card */}
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={`tel:${CLINIC.phoneDial}`}
                className="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-soft transition shadow-hover hover:border-sky-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-xl group-hover:scale-110 transition">
                  📞
                </div>
                <div className="mt-3 text-[11px] font-bold uppercase text-slate-400">Direct Call</div>
                <div className="mt-1 text-sm font-extrabold text-sky-700">{CLINIC.phone}</div>
                <div className="mt-1 text-[11px] text-slate-500">Reception &amp; Enquiries</div>
              </a>

              <a
                href={waLink("Hello Daily Dental Care, I have a question regarding clinic appointments.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-soft transition shadow-hover hover:bg-emerald-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl group-hover:scale-110 transition">
                  💬
                </div>
                <div className="mt-3 text-[11px] font-bold uppercase text-emerald-800">WhatsApp Chat</div>
                <div className="mt-1 text-sm font-extrabold text-emerald-700">Chat Instantly</div>
                <div className="mt-1 text-[11px] text-emerald-800/80">Average response: &lt; 5 mins</div>
              </a>
            </div>

            {/* Hours Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft">
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-800">
                Opening Hours
              </span>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600 font-medium">Monday – Saturday:</span>
                  <span className="font-bold text-slate-900">10:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600 font-medium">Daily Lunch Break:</span>
                  <span className="font-semibold text-slate-700">1:00 PM – 2:00 PM</span>
                </div>
                <div className="flex justify-between text-rose-600 font-semibold pt-1">
                  <span>Sunday:</span>
                  <span>Closed (Emergency on Call)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-soft">
            <iframe
              src={CLINIC.mapsEmbed}
              title="Daily Dental Care Mohali Location"
              className="h-72 w-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

