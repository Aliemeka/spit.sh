import MainLayout from "@/layouts/MainLayout";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
