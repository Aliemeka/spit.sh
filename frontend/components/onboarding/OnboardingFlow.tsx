"use client";
import { useOnboarding } from "@/hooks/useOnboarding";
import PersonalDetailsStep from "@/components/onboarding/PersonalDetailsStep";
import NewProjectStep from "@/components/onboarding/NewProjectStep";

export default function OnboardingFlow() {
  const { step, setStep, isLoading, submitProfile, submitProject } =
    useOnboarding();

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-2xl font-bold text-white tracking-tight">
        spit<span className="text-fuchsia-500">.sh</span>
      </div>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8">
        {/* Step dots */}
        <div className="flex gap-2 justify-center mb-8">
          <span
            className={`h-2 w-6 rounded-full transition-all ${
              step === 1 ? "bg-fuchsia-500" : "bg-zinc-700"
            }`}
          />
          <span
            className={`h-2 w-6 rounded-full transition-all ${
              step === 2 ? "bg-fuchsia-500" : "bg-zinc-700"
            }`}
          />
        </div>

        {step === 1 && (
          <PersonalDetailsStep onSubmit={submitProfile} isLoading={isLoading} />
        )}
        {step === 2 && (
          <NewProjectStep
            onSubmit={submitProject}
            onBack={() => setStep(1)}
            isLoading={isLoading}
          />
        )}
      </div>
    </main>
  );
}
