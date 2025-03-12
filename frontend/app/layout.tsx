import { PlusJakartaSans } from "@/lib/font";
import Provider from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spit.sh - Shorter URLs with extra magic",
  description: "Get more out of your links with analytics and tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body style={PlusJakartaSans.style}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
