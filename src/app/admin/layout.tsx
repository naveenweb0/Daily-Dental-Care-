import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import Shell from "@/components/admin/Shell";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clinic Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return <Shell user={{ name: user.name, role: user.role }}>{children}</Shell>;
}
