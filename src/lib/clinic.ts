export const CLINIC = {
  name: "Daily Dental Care",
  tagline:
    "Advanced, affordable and painless dentistry with expert dental care and modern facilities.",
  address:
    "SCF-124, 1st Floor, Phase 7, Sector 61, Sahibzada Ajit Singh Nagar, Punjab 160062",
  city: "Mohali / SAS Nagar, Punjab",
  phone: "097791 25467",
  phoneDial: "+919779125467",
  whatsapp: "919779125467",
  website: "https://dailydentalcare.in",
  email: "contact@dailydentalcare.in",
  rating: "5.0",
  reviews: "120+",
  category: "Multi-specialty Dental Clinic",
  mapsEmbed:
    "https://www.google.com/maps?q=SCF-124,%201st%20Floor,%20Phase%207,%20Sector%2061,%20Sahibzada%20Ajit%20Singh%20Nagar,%20Punjab%20160062&output=embed",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=SCF-124%2C%201st%20Floor%2C%20Phase%207%2C%20Sector%2061%2C%20Sahibzada%20Ajit%20Singh%20Nagar%2C%20Punjab%20160062",
  reviewsLink:
    "https://www.google.com/maps/search/?api=1&query=Daily%20Dental%20Care%20Mohali",
};

export function waLink(text: string) {
  return `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const LEAD_SOURCES = [
  "website",
  "appointment_form",
  "contact_form",
  "whatsapp",
  "phone",
  "google",
  "instagram",
  "facebook",
  "referral",
  "other",
] as const;

export const LEAD_STAGES = [
  "new",
  "contacted",
  "interested",
  "appointment_requested",
  "appointment_confirmed",
  "visited",
  "treatment_started",
  "converted",
  "lost",
  "no_response",
] as const;

export const APPOINTMENT_STATUSES = [
  "new",
  "pending",
  "confirmed",
  "rescheduled",
  "checked_in",
  "completed",
  "cancelled",
  "no_show",
] as const;

export function label(value: string) {
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const STATUS_COLORS: Record<string, string> = {
  new: "bg-sky-100 text-sky-700",
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  rescheduled: "bg-violet-100 text-violet-700",
  checked_in: "bg-cyan-100 text-cyan-700",
  completed: "bg-slate-200 text-slate-700",
  cancelled: "bg-rose-100 text-rose-700",
  no_show: "bg-orange-100 text-orange-700",
};
