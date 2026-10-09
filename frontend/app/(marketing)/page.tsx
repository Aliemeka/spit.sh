import Features from "@/components/pageBundles/landingPage/Features";
import Footer from "@/components/pageBundles/landingPage/Footer";
import Hero from "@/components/pageBundles/landingPage/Hero";
import HowItWorks from "@/components/pageBundles/landingPage/HowItWorks";
import Navbar from "@/components/pageBundles/landingPage/Navbar";
import Pricing from "@/components/pageBundles/landingPage/Pricing";

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
