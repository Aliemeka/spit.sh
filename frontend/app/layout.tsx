import { PlusJakartaSans } from "@/lib/font";
import Provider from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spit.sh - Shorter URLs with extra magic",
  description: "Get more out of your links with analytics and tracking",
  openGraph: {
    title: "Spit.sh - Shorter URLs with extra magic",
    description: "Get more out of your links with analytics and tracking",
    url: "https://spit.sh",
    siteName: "Spit.sh",
    images: [
      {
        url: "https://res.cloudinary.com/emekadinary/image/upload/q_65/v1774506445/spit-sh/Spit-sh-banner_udl2fh.webp",
        width: 1200,
        height: 630,
        alt: "Spit.sh - Shorter URLs with extra magic",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spit.sh - Shorter URLs with extra magic",
    description: "Get more out of your links with analytics and tracking",
    images: [
      "https://res.cloudinary.com/emekadinary/image/upload/q_65/v1774506445/spit-sh/Spit-sh-banner_udl2fh.webp",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body style={PlusJakartaSans.style}>
        <Provider>
          <Toaster position='top-right' richColors />
          {children}
        </Provider>
      </body>
    </html>
  );
}
