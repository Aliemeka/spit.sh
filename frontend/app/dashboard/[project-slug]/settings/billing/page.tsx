import { Suspense } from "react";
import DashboardContainer from "@/components/blocks/DashboardContainer";
import BillingOverview from "@/components/pageBundles/billingPage/BillingOverview";
import BillingSkeleton from "@/components/pageBundles/billingPage/BillingSkeleton";

const BillingPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ "project-slug": string }>;
  searchParams: Promise<{ checkout?: string }>;
}) => {
  const { "project-slug": projectSlug } = await params;
  const { checkout } = await searchParams;

  return (
    <DashboardContainer title='Billing'>
      <Suspense fallback={<BillingSkeleton />}>
        <BillingOverview
          projectSlug={projectSlug}
          checkoutSuccess={checkout === "success"}
        />
      </Suspense>
    </DashboardContainer>
  );
};

export default BillingPage;
