import { Suspense } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import FilterBar from "@/components/analytics/FilterBar";
import ClicksHeroChart from "@/components/analytics/ClicksHeroChart";
import TopLinksWidget from "@/components/analytics/TopLinksWidget";
import TopReferersWidget from "@/components/analytics/TopReferersWidget";
import TopCountriesWidget from "@/components/analytics/TopCountriesWidget";
import TopCitiesWidget from "@/components/analytics/TopCitiesWidget";
import DonutTabbedWidget from "@/components/analytics/DonutTabbedWidget";
import UtmTabbedWidget from "@/components/analytics/UtmTabbedWidget";

const AnalyticsContent = ({ projectSlug }: { projectSlug: string }) => {
  return (
    <>
      <FilterBar projectSlug={projectSlug} />
      <ClicksHeroChart projectSlug={projectSlug} />

      <div className='grid gap-5 md:grid-cols-2 mb-5'>
        <TopLinksWidget projectSlug={projectSlug} />
        <TopReferersWidget projectSlug={projectSlug} />
      </div>

      <div className='grid gap-5 md:grid-cols-2 mb-5'>
        <TopCountriesWidget projectSlug={projectSlug} />
        <TopCitiesWidget projectSlug={projectSlug} />
      </div>

      <div className='grid gap-5 mb-5'>
        <DonutTabbedWidget projectSlug={projectSlug} />
      </div>

      <div className='grid gap-5'>
        <UtmTabbedWidget projectSlug={projectSlug} />
      </div>
    </>
  );
};

const AnalyticsPage = async ({
  params,
}: {
  params: Promise<{ "project-slug": string }>;
}) => {
  const { "project-slug": projectSlug } = await params;

  return (
    <DashboardLayout title='Analytics'>
      <Suspense fallback={null}>
        <AnalyticsContent projectSlug={projectSlug} />
      </Suspense>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
