import Cta from "@/components/pageBundles/landingPage/Cta";
import Features from "@/components/pageBundles/landingPage/Features";
import Hero from "@/components/pageBundles/landingPage/Hero";
import HowItWorks from "@/components/pageBundles/landingPage/HowItWorks";
import Pricing from "@/components/pageBundles/landingPage/Pricing";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Cta />
    </>
  );
}
