import React from "react";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Spit.sh - Dashboard",
  description: "Get more out of your links with analytics and tracking",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
