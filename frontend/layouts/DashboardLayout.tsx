import React, { FC, PropsWithChildren } from "react";

const DashboardLayout: FC<
  PropsWithChildren<{ SideButton?: React.ReactNode; title: string }>
> = ({ children, SideButton, title }) => {
  return (
    <section>
      <header className='flex w-full justify-between'>
        <h1 className='text-2xl text-zinc-900 dark:text-zinc-200 mb-3 font-semibold'>
          {title}
        </h1>
        {SideButton ? <>{SideButton}</> : null}
      </header>
      {children}
    </section>
  );
};

export default DashboardLayout;
