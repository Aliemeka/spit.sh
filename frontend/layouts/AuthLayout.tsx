import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Sigin to Spit.sh</title>
      </Head>
      {children}
    </>
  );
};

export default AuthLayout;
