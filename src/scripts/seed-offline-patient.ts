import "dotenv/config";
import { db, pool } from "../db/index";
import { patients, clinicalRecords, patientReports, appointments, appointmentHistory } from "../db/schema";
import { hashPatientPassword } from "../lib/patientAuth";
import { eq } from "drizzle-orm";

async function run() {
  const phone = "9876543210";
  const existing = await db.select().from(patients).where(eq(patients.phone, phone)).limit(1);

  let patientId: number;

  if (existing[0]) {
    patientId = existing[0].id;
    await db
      .update(patients)
      .set({
        name: "Ramesh Sharma",
        email: "ramesh.sharma@example.com",
        passwordHash: hashPatientPassword(phone),
        gender: "male",
        age: 36,
        bloodGroup: "B+",
        address: "House #142, Sector 61, Phase 7, Mohali",
        medicalHistory: "No known drug allergies. Mild sensitivity to cold beverages.",
        emergencyContact: "9811122334 (Spouse)",
        source: "offline_desk",
      })
      .where(eq(patients.id, patientId));
  } else {
    const inserted = await db
      .insert(patients)
      .values({
        name: "Ramesh Sharma",
        phone,
        email: "ramesh.sharma@example.com",
        passwordHash: hashPatientPassword(phone),
        gender: "male",
        age: 36,
        bloodGroup: "B+",
        address: "House #142, Sector 61, Phase 7, Mohali",
        medicalHistory: "No known drug allergies. Mild sensitivity to cold beverages.",
        emergencyContact: "9811122334 (Spouse)",
        source: "offline_desk",
      })
      .returning();
    patientId = inserted[0].id;
  }

  // Insert a sample clinical record
  const existingRecords = await db.select().from(clinicalRecords).where(eq(clinicalRecords.patientId, patientId));
  if (existingRecords.length === 0) {
    await db.insert(clinicalRecords).values([
      {
        patientId,
        doctorName: "Dr. Daily Dental MDS (Endodontist)",
        visitDate: new Date().toISOString().slice(0, 10),
        chiefComplaint: "Acute pain and deep sensitivity in lower right molar (Tooth #46).",
        diagnosis: "Irreversible Pulpitis with symptomatic periapical tenderness.",
        treatmentDone: "Single-Sitting Computerized Rotary RCT performed with bioceramic obturation under local anaesthesia.",
        doctorRemarks: "Procedure uneventful. Crown preparation scheduled after 5 days. Maintain warm saline gargles 3 times a day. Avoid hard foods on right side for 48 hours.",
        nextRecallDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
        prescription: [
          { medicine: "Amoxicillin 500mg", dosage: "1 Tablet", frequency: "1-0-1 (Twice daily)", duration: "5 Days", instructions: "After meals" },
          { medicine: "Ketorol DT 10mg", dosage: "1 Dispersible Tab", frequency: "SOS (When pain)", duration: "3 Days", instructions: "Dissolve in half glass water" },
          { medicine: "Pantoprazole 40mg", dosage: "1 Capsule", frequency: "1-0-0 (Morning)", duration: "5 Days", instructions: "Empty stomach before breakfast" },
        ],
      },
    ]);
  }

  // Insert sample reports & X-rays
  const existingReports = await db.select().from(patientReports).where(eq(patientReports.patientId, patientId));
  if (existingReports.length === 0) {
    await db.insert(patientReports).values([
      {
        patientId,
        title: "Full Mouth Digital OPG & Intraoral RVG (#46)",
        reportType: "xray",
        fileUrl: "https://images.pexels.com/photos/6627575/pexels-photo-6627575.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        notes: "Digital RVG shows complete 3D canal obturation up to anatomical apex without extrusion.",
        doctorRemarks: "Excellent apical seal achieved. Ready for zirconia crown placement.",
        issuedDate: new Date().toISOString().slice(0, 10),
        uploadedBy: "Dr. Daily Dental",
      },
      {
        patientId,
        title: "Comprehensive Dental Treatment Plan & 0% EMI Breakdown",
        reportType: "treatment_plan",
        fileUrl: "",
        notes: "Includes Rotary RCT + Metal-Free 3D Zirconia Crown with 10-year warranty.",
        doctorRemarks: "0% Interest 6-month EMI approved.",
        issuedDate: new Date().toISOString().slice(0, 10),
        uploadedBy: "Reception Front Desk",
      },
    ]);
  }

  console.log("Offline demo patient & clinical records seeded successfully! Patient ID:", patientId);
  await pool.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
