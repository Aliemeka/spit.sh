import Footer from "@/layouts/Footer";
import Navbar from "@/layouts/Navbar";
import React, { ReactNode } from "react";

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-200'>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
