import { Suspense } from "react";
import DashboardContainer from "@/components/blocks/DashboardContainer";
import BillingOverview from "@/components/pageBundles/billingPage/BillingOverview";
import BillingSkeleton from "@/components/pageBundles/billingPage/BillingSkeleton";

const BillingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) => {
  const { checkout } = await searchParams;

  return (
    <DashboardContainer title='Billing'>
      <Suspense fallback={<BillingSkeleton />}>
        <BillingOverview checkoutSuccess={checkout === "success"} />
      </Suspense>
    </DashboardContainer>
  );
};

export default BillingPage;
