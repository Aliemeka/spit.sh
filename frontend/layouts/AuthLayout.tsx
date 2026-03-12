import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

export default AuthLayout;
