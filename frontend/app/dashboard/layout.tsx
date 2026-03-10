import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import React, { FC, PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Spit.sh - Dashboard",
  description: "Get more out of your links with analytics and tracking",
};

const DashLayout: FC<PropsWithChildren> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashLayout;
