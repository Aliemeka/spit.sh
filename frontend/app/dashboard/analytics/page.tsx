import { Suspense } from "react";
import DashboardContainer from "@/components/blocks/DashboardContainer";
import FilterBar from "@/components/analytics/FilterBar";
import ClicksHeroChart from "@/components/analytics/ClicksHeroChart";
import TopLinksWidget from "@/components/analytics/TopLinksWidget";
import TopReferersWidget from "@/components/analytics/TopReferersWidget";
import TopCountriesWidget from "@/components/analytics/TopCountriesWidget";
import TopCitiesWidget from "@/components/analytics/TopCitiesWidget";
import DonutTabbedWidget from "@/components/analytics/DonutTabbedWidget";
import UtmTabbedWidget from "@/components/analytics/UtmTabbedWidget";

const AnalyticsContent = () => {
  return (
    <>
      <FilterBar />
      <ClicksHeroChart />

      <div className='grid gap-5 md:grid-cols-2 mb-5'>
        <TopLinksWidget />
        <TopReferersWidget />
      </div>

      <div className='grid gap-5 md:grid-cols-2 mb-5'>
        <TopCountriesWidget />
        <TopCitiesWidget />
      </div>

      <div className='grid gap-5 mb-5'>
        <DonutTabbedWidget />
      </div>

      <div className='grid gap-5'>
        <UtmTabbedWidget />
      </div>
    </>
  );
};

const AnalyticsPage = () => {
  return (
    <DashboardContainer title='Analytics'>
      <Suspense fallback={null}>
        <AnalyticsContent />
      </Suspense>
    </DashboardContainer>
  );
};

export default AnalyticsPage;
