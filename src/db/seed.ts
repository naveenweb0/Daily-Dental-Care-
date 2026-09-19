import "dotenv/config";
import { sql } from "drizzle-orm";
import { db, pool } from "./index";
import {
  clinicHours,
  doctors,
  services,
  users,
  patients,
  leads,
  appointments,
  appointmentHistory,
  notifications,
} from "./schema";
import { hashPassword } from "../lib/auth";

const IMG = {
  implants: "https://images.pexels.com/photos/6627575/pexels-photo-6627575.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  aligners: "https://images.pexels.com/photos/6627716/pexels-photo-6627716.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ortho: "https://images.pexels.com/photos/8260441/pexels-photo-8260441.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  crown: "https://images.pexels.com/photos/6627721/pexels-photo-6627721.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  rct: "https://images.pexels.com/photos/19976573/pexels-photo-19976573.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cleaning: "https://images.pexels.com/photos/19976607/pexels-photo-19976607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  whitening: "https://images.pexels.com/photos/6627703/pexels-photo-6627703.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  dentures: "https://images.pexels.com/photos/6627725/pexels-photo-6627725.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cosmetic: "https://images.pexels.com/photos/6627826/pexels-photo-6627826.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  general: "https://images.pexels.com/photos/19879757/pexels-photo-19879757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

const SERVICES = [
  ["Dental Implants", "dental-implants", IMG.implants, 60, "Permanent tooth replacement that looks and functions like a natural tooth."],
  ["Invisalign / Clear Aligners", "invisalign-clear-aligners", IMG.aligners, 45, "Discreet, removable aligners that gradually straighten your teeth."],
  ["Orthodontics", "orthodontics", IMG.ortho, 45, "Braces and alignment treatment for a balanced, functional bite."],
  ["Dental Crowns", "dental-crowns", IMG.crown, 45, "Durable caps that restore strength and shape to damaged teeth."],
  ["Root Canal Treatment", "root-canal-treatment", IMG.rct, 60, "Comfortable, modern endodontic care to save an infected tooth."],
  ["Teeth Cleaning", "teeth-cleaning", IMG.cleaning, 30, "Professional scaling and polishing for healthy gums and fresh breath."],
  ["Teeth Whitening", "teeth-whitening", IMG.whitening, 45, "Safe, in-clinic whitening for a brighter natural shade."],
  ["Dentures", "dentures", IMG.dentures, 45, "Comfortable partial and complete dentures customised for you."],
  ["Cosmetic Dentistry", "cosmetic-dentistry", IMG.cosmetic, 45, "Smile design treatments tailored to your facial aesthetics."],
  ["General Dentistry", "general-dentistry", IMG.general, 30, "Routine check-ups, fillings and preventive dental care."],
] as const;

async function main() {
  const existing = await db.select({ c: sql<number>`count(*)::int` }).from(services);
  if ((existing[0]?.c ?? 0) > 0) {
    console.log("Seed already applied. Skipping.");
    await pool.end();
    return;
  }

  await db.insert(users).values([
    {
      name: "Clinic Owner",
      email: "admin@dailydentalcare.in",
      passwordHash: hashPassword(process.env.SEED_ADMIN_PASSWORD || "Admin@12345"),
      role: "super_admin",
    },
    {
      name: "Front Desk",
      email: "reception@dailydentalcare.in",
      passwordHash: hashPassword(process.env.SEED_STAFF_PASSWORD || "Reception@12345"),
      role: "receptionist",
    },
  ]);

  const svcRows = await db
    .insert(services)
    .values(
      SERVICES.map(([name, slug, image, duration, short], i) => ({
        name,
        slug,
        image,
        durationMinutes: duration,
        shortDescription: short,
        description: `${short} At Daily Dental Care, ${name.toLowerCase()} is planned after a clinical examination so that your treatment is comfortable, predictable and suited to your oral health needs.`,
        price: "Contact for price",
        benefits: [
          "Personalised treatment planning after clinical examination",
          "Modern equipment and strict sterilisation protocols",
          "Comfort-focused, painless approach",
          "Clear explanation of options before you decide",
        ],
        procedure: [
          "Consultation and clinical examination",
          "Diagnosis, imaging where required, and treatment plan discussion",
          "Treatment carried out in planned appointments",
          "Review and aftercare guidance",
        ],
        suitableFor: [
          "Patients advised this treatment after a dental examination",
          "Patients looking for a long-term, functional solution",
          "Patients who want to discuss available options with a dentist",
        ],
        faqs: [
          { q: "How long does the treatment take?", a: `Typical appointments are around ${duration} minutes. The overall plan depends on your clinical needs and will be explained during your consultation.` },
          { q: "Is the treatment painful?", a: "Our approach is comfort-focused. Local anaesthesia and modern techniques are used where appropriate." },
          { q: "What is the cost?", a: "Cost depends on the clinical requirement. Please contact the clinic for a personalised estimate." },
        ],
        sortOrder: i,
        seoTitle: `${name} in Mohali | Daily Dental Care`,
        seoDescription: `${short} ${name} at Daily Dental Care, Phase 7, Sector 61, Mohali (SAS Nagar).`,
      })),
    )
    .returning();

  const allIds = svcRows.map((s) => s.id);
  const docRows = await db
    .insert(doctors)
    .values([
      {
        name: "General & Preventive Dentistry",
        qualification: "Dental Surgeon",
        specialization: "General Dentistry, Cleaning, Fillings",
        experience: "Experienced dental professional",
        bio: "Demo profile — edit or replace this doctor from the admin panel with your clinic's actual team details.",
        photo: IMG.general,
        serviceIds: allIds,
      },
      {
        name: "Implants & Oral Surgery",
        qualification: "Dental Surgeon",
        specialization: "Dental Implants, Surgical Procedures",
        experience: "Experienced dental professional",
        bio: "Demo profile — edit or replace this doctor from the admin panel with your clinic's actual team details.",
        photo: IMG.implants,
        serviceIds: allIds,
      },
      {
        name: "Orthodontics & Aligners",
        qualification: "Dental Surgeon",
        specialization: "Braces, Clear Aligners",
        experience: "Experienced dental professional",
        bio: "Demo profile — edit or replace this doctor from the admin panel with your clinic's actual team details.",
        photo: IMG.aligners,
        serviceIds: allIds,
      },
    ])
    .returning();

  const hourRows: (typeof clinicHours.$inferInsert)[] = [];
  for (let d = 0; d < 7; d++) {
    hourRows.push({
      doctorId: null,
      weekday: d,
      isOpen: d !== 0,
      openTime: "10:00",
      closeTime: "19:00",
      breakStart: "13:00",
      breakEnd: "14:00",
    });
  }
  for (const doc of docRows) {
    for (let d = 0; d < 7; d++) {
      hourRows.push({
        doctorId: doc.id,
        weekday: d,
        isOpen: d !== 0,
        openTime: "10:00",
        closeTime: "19:00",
        breakStart: "13:00",
        breakEnd: "14:00",
      });
    }
  }
  await db.insert(clinicHours).values(hourRows);

  // demo data (clearly marked)
  const demoPatients = await db
    .insert(patients)
    .values([
      { name: "[DEMO] Ramesh Kumar", phone: "9000000001", email: "demo1@example.com", age: 34, isDemo: true, source: "google" },
      { name: "[DEMO] Simran Kaur", phone: "9000000002", email: "demo2@example.com", age: 27, isDemo: true, source: "instagram" },
    ])
    .returning();

  const demoLeads = await db
    .insert(leads)
    .values([
      { name: "[DEMO] Ramesh Kumar", phone: "9000000001", email: "demo1@example.com", serviceId: svcRows[0].id, patientId: demoPatients[0].id, source: "google", stage: "contacted", isDemo: true, message: "Demo record for testing" },
      { name: "[DEMO] Simran Kaur", phone: "9000000002", email: "demo2@example.com", serviceId: svcRows[1].id, patientId: demoPatients[1].id, source: "instagram", stage: "appointment_requested", isDemo: true, message: "Demo record for testing" },
    ])
    .returning();

  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const tomorrow = new Date(today.getTime() + 86400000);

  const appts = await db
    .insert(appointments)
    .values([
      {
        appointmentNumber: `DDC-${iso(tomorrow).replace(/-/g, "")}-001`,
        patientId: demoPatients[0].id,
        leadId: demoLeads[0].id,
        doctorId: docRows[0].id,
        serviceId: svcRows[0].id,
        patientName: "[DEMO] Ramesh Kumar",
        phone: "9000000001",
        email: "demo1@example.com",
        age: 34,
        appointmentDate: iso(tomorrow),
        startTime: "11:00",
        endTime: "12:00",
        status: "confirmed",
        source: "google",
        isDemo: true,
        patientMessage: "Demo appointment record",
      },
    ])
    .returning();

  await db.insert(appointmentHistory).values({
    appointmentId: appts[0].id,
    action: "created",
    newValue: "confirmed (demo)",
    actor: "seed",
  });

  await db.insert(notifications).values({
    type: "system",
    title: "Welcome to Daily Dental Care CRM",
    body: "Demo records are marked with [DEMO]. Replace them with real data from the admin panel.",
    link: "/admin",
  });

  console.log("Seed complete.");
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
