import React, { FC, PropsWithChildren, ReactNode } from "react";
import Unboxing from "../illustrations/Unboxing";

interface EmptyStateProps {
  text: string;
  illustration?: ReactNode;
}

const EmptyState: FC<PropsWithChildren<EmptyStateProps>> = ({
  text,
  children,
  illustration,
}) => {
  return (
    <div className='flex flex-col justify-center gap-y-4 items-center place-items-center h-[600px] max-w-[600px] mx-auto w-full text-zinc-700 dark:text-zinc-300'>
      {illustration ? illustration : <Unboxing />}
      <p className='text-sm md:text-base'>{text}</p>
      {children}
    </div>
  );
};

export default EmptyState;
