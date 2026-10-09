import Features from "@/components/pageBundles/landingOne/Features";
import Footer from "@/components/pageBundles/landingOne/Footer";
import Hero from "@/components/pageBundles/landingOne/Hero";
import HowItWorks from "@/components/pageBundles/landingOne/HowItWorks";
import Navbar from "@/components/pageBundles/landingOne/Navbar";
import Pricing from "@/components/pageBundles/landingOne/Pricing";

export default function Home() {
  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-200'>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
