import { redirect } from "next/navigation";
import { getSessionPatient } from "@/lib/patientAuth";

export const dynamic = "force-dynamic";

export default async function PatientRootPage() {
  const patient = await getSessionPatient();
  if (!patient) {
    redirect("/patient/login");
  }
  redirect("/patient/dashboard");
}
