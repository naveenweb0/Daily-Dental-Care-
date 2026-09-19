"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

type CaseItem = {
  id: string;
  title: string;
  category: string;
  duration: string;
  doctor: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  serviceSlug: string;
};

const CASES: CaseItem[] = [
  {
    id: "whitening",
    title: "Laser Teeth Whitening & Polish",
    category: "Cosmetic Dentistry",
    duration: "45 minutes (1 session)",
    doctor: "Dr. Ananya Sharma",
    description: "Deep intrinsic coffee and tea stains lightened by 6 shades in a single in-office painless laser session.",
    beforeImg: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    afterImg: "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    serviceSlug: "teeth-cleaning",
  },
  {
    id: "aligners",
    title: "Invisalign Clear Aligners",
    category: "Orthodontics",
    duration: "7 months",
    doctor: "Dr. Rohan Kapoor",
    description: "Severe anterior crowding and deep overbite corrected seamlessly with customized invisible clear aligners.",
    beforeImg: "https://images.pexels.com/photos/6627827/pexels-photo-6627827.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    afterImg: "https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    serviceSlug: "invisalign-clear-aligners",
  },
  {
    id: "implants",
    title: "Permanent Single Dental Implant",
    category: "Implantology",
    duration: "Single Day Procedure",
    doctor: "Dr. Vikram Sethi",
    description: "Natural-looking titanium root implant with premium zirconia crown restoring full chewing power and aesthetics.",
    beforeImg: "https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    afterImg: "https://images.pexels.com/photos/6812472/pexels-photo-6812472.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    serviceSlug: "dental-implants",
  },
  {
    id: "veneers",
    title: "Porcelain Ceramic Smile Makeover",
    category: "Smile Design",
    duration: "2 visits",
    doctor: "Dr. Ananya Sharma",
    description: "Chipped and uneven lateral incisors restored with ultra-thin, lifelike custom ceramic veneers.",
    beforeImg: "https://images.pexels.com/photos/6529116/pexels-photo-6529116.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    afterImg: "https://images.pexels.com/photos/3779708/pexels-photo-3779708.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    serviceSlug: "dental-crowns-and-bridges",
  },
];

export default function BeforeAfterSlider() {
  const [activeTab, setActiveTab] = useState<string>("whitening");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCase = CASES.find((c) => c.id === activeTab) || CASES[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft sm:p-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-sky-600">
            Real Transformations
          </span>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Before &amp; After Clinical Results
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {CASES.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSliderPosition(50);
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeTab === item.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.title.split(" ")[0]} {item.title.split(" ")[1] ?? ""}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-6 grid items-center gap-8 lg:grid-cols-12">
        {/* Visual Slider */}
        <div className="lg:col-span-7">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="relative h-[280px] sm:h-[380px] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl shadow-inner bg-slate-900"
          >
            {/* After Image (Background) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentCase.afterImg}
              alt={`${currentCase.title} After`}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <div className="absolute top-4 right-4 rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur shadow-sm">
              AFTER RESULT ✨
            </div>

            {/* Before Image (Clipped Overlay) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentCase.beforeImg}
                alt={`${currentCase.title} Before`}
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute top-4 left-4 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur shadow-sm">
                BEFORE
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-white shadow-xl">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center text-xs text-slate-400">
            👈 Drag slider to compare Before and After results 👉
          </div>
        </div>

        {/* Case Information & CTAs */}
        <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
          <div>
            <span className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
              {currentCase.category}
            </span>
            <h4 className="mt-2 text-2xl font-bold text-slate-900">
              {currentCase.title}
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {currentCase.description}
            </p>

            <div className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Treatment Duration:</span>
                <span className="font-semibold text-slate-800">{currentCase.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Treating Specialist:</span>
                <span className="font-semibold text-slate-800">{currentCase.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pain Level:</span>
                <span className="font-semibold text-emerald-600">Zero / Local Anesthetic</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/book?service=${currentCase.serviceSlug}`}
              className="flex-1 rounded-full bg-sky-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-sky-700"
            >
              Book Similar Smile Design
            </Link>
            <Link
              href={`/treatments/${currentCase.serviceSlug}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:border-slate-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
