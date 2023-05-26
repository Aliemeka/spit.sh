import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";
import Navbar from "./Navbar";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Spit.sh | Shorter URLs with extra magic</title>
      </Head>
      <Navbar />
      <main
        className={`min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 relative dot-overlay`}
      >
        {children}
      </main>
    </>
  );
};

export default MainLayout;
