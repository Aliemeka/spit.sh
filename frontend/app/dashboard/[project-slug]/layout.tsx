import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

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
