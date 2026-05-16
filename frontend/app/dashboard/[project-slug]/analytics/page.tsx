"use client";
import { Kbd } from "@/components/ui/kbd";
import PrimaryButton from "@/components/ui/primary-button";
import DashboardLayout from "@/layouts/DashboardLayout";
import { FileTextIcon } from "@phosphor-icons/react";
import React from "react";

const AnalyticsPage = () => {
  return (
    <DashboardLayout
      title='Analytics'
      SideButton={
        <PrimaryButton icon={<Kbd>D</Kbd>}>
          <span>Generate Report</span>
        </PrimaryButton>
      }
    >
      Anayltics coming soon...
    </DashboardLayout>
  );
};

export default AnalyticsPage;
