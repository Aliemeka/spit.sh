import { type ChartConfig } from "@/components/evilcharts/ui/chart";

const FUCHSIA_LIGHT = "#c026d3";
const FUCHSIA_DARK = "#e879f9";

const DONUT_PALETTE: { light: string; dark: string }[] = [
  { light: "#3b82f6", dark: "#60a5fa" },
  { light: "#10b981", dark: "#34d399" },
  { light: "#f59e0b", dark: "#fbbf24" },
  { light: "#8b5cf6", dark: "#a78bfa" },
  { light: "#ec4899", dark: "#f472b6" },
  { light: "#71717a", dark: "#a1a1aa" },
];

export const clicksAreaConfig: ChartConfig = {
  clicks: {
    label: "Clicks",
    colors: {
      light: [FUCHSIA_LIGHT],
      dark: [FUCHSIA_DARK],
    },
  },
};

export function buildDonutConfig(
  entries: { key: string; label: string }[],
): ChartConfig {
  return entries.reduce<ChartConfig>((acc, entry, idx) => {
    const colors = DONUT_PALETTE[idx % DONUT_PALETTE.length];
    acc[entry.key] = {
      label: entry.label,
      colors: {
        light: [colors.light],
        dark: [colors.dark],
      },
    };
    return acc;
  }, {});
}
