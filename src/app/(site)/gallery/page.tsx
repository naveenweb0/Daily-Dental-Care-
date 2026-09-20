import type { Metadata } from "next";
import Link from "next/link";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Before & After Results and Clinic Gallery | Daily Dental Care Mohali",
  description: "View real dental transformation cases, clinical operatories, and modern sterilisation technology in Mohali.",
  alternates: { canonical: "/gallery" },
};

const CLINIC_PHOTOS = [
  {
    src: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    title: "Sterile Surgical Operatory",
    tag: "Operatory",
  },
  {
    src: "https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    title: "Digital 3D Dental Scanning Station",
    tag: "Technology",
  },
  {
    src: "https://images.pexels.com/photos/6627826/pexels-photo-6627826.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    title: "Comfort Patient Consultation Suite",
    tag: "Reception & Lounge",
  },
  {
    src: "https://images.pexels.com/photos/19976607/pexels-photo-19976607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    title: "Advanced Rotary Endodontics Unit",
    tag: "RCT Suite",
  },
  {
    src: "https://images.pexels.com/photos/6812472/pexels-photo-6812472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    title: "Implant Surgery Precision Setup",
    tag: "Implantology",
  },
  {
    src: "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    title: "Cold Laser Whitening Treatment Area",
    tag: "Cosmetic",
  },
];

export default async function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 space-y-16">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800">
          Visual Evidence
        </span>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Smile Transformations &amp; Clinic Tour
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Explore our real patient case outcomes, advanced 3D scanning suites, and hospital-grade sterilisation infrastructure in Phase 7 Mohali.
        </p>
      </div>

      {/* Interactive Transformation Slider */}
      <div>
        <BeforeAfterSlider />
      </div>

      {/* Facility & Treatment Photos */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">Clinic Environment &amp; Operatories</h2>
            <p className="text-xs text-slate-500">A clean, calming, and ultra-hygienic setting designed for anxiety-free dentistry.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CLINIC_PHOTOS.map((img, idx) => (
            <figure
              key={idx}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition shadow-hover"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                  {img.tag}
                </span>
              </div>
              <figcaption className="p-5 font-bold text-sm text-slate-800">
                {img.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 p-8 text-center text-white sm:p-12 shadow-soft">
        <h3 className="font-heading text-2xl font-bold sm:text-3xl">Want to Transform Your Own Smile?</h3>
        <p className="mx-auto mt-2 max-w-xl text-xs text-slate-300 sm:text-sm">
          Book a digital smile evaluation with our MDS cosmetic team in Mohali today.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/book"
            className="rounded-full bg-sky-500 px-8 py-3.5 text-xs font-bold text-slate-950 shadow-soft hover:bg-sky-400"
          >
            📅 Book Your Smile Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}

