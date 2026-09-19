import { redirect } from "next/navigation";
import AnalyticsClient from "@/components/admin/AnalyticsClient";
import { can, getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!can(user.role, "analytics")) {
    return <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">You do not have permission to view analytics.</p>;
  }
  return <AnalyticsClient />;
}
