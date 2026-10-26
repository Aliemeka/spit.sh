import { redirect } from "next/navigation";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { getProjects } from "@/lib/workspace";
import { dashboardRoutes } from "@/lib/constants/routes";

export default async function OnboardingPage() {
  const projects = await getProjects().catch(() => []);
  if (projects.length > 0) redirect(dashboardRoutes.home);

  return <OnboardingFlow />;
}
