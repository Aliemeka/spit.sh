import React, { FC } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

const ThemeProvider = NextThemeProvider as FC<ThemeProviderProps>;

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <div className='relative'>{children}</div>
    </ThemeProvider>
  );
}

export default Provider;
