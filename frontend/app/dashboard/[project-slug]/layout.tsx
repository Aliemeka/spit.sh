import DashboardLayout from "@/layouts/DashboardLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spit.sh - Dashboard",
  description: "Get more out of your links with analytics and tracking",
};

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
