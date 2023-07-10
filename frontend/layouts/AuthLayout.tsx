import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Sigin to Spit.sh | Shorter URLs with extra magic</title>
      </Head>
      {children}
    </>
  );
};

export default AuthLayout;
