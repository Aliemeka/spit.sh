"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/app/actions/user";
import { createProjectAction } from "@/app/actions/project";
import { useToast } from "@/hooks/useToast";
import { dashboardRoutes } from "@/lib/constants/routes";

export function useOnboarding() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const submitProfile = async (values: {
    first_name: string;
    last_name: string;
  }) => {
    setIsLoading(true);
    try {
      await updateProfileAction(values);
      showToast("Profile saved!", "success");
      setStep(2);
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const submitProject = async (values: {
    name: string;
    slug: string;
    logo?: string;
  }) => {
    setIsLoading(true);
    try {
      await createProjectAction(values);
      showToast("Project created!", "success");
      router.push(dashboardRoutes.home);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        showToast(
          "That slug is already taken. Please choose another.",
          "warning"
        );
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { step, setStep, isLoading, submitProfile, submitProject };
}
