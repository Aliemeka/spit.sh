import { Plus_Jakarta_Sans as PlusJakartaSansFont } from "next/font/google";

export const PlusJakartaSans = PlusJakartaSansFont({
  display: "swap",
  preload: true,
  subsets: ["latin", "cyrillic-ext"],
  weight: ["200", "300", "400", "500", "600", "700"],
});
