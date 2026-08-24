// src/pages/setup/SchoolSetup.tsx

import { useState } from "react";

import { AlertCircle, Check } from "lucide-react";

import { useSchoolSetup } from "@/hooks/useSchoolSetup";

import SchoolIdentity from "@/features/setup/school/SchoolIdentity";
import ContactAcademic from "@/features/setup/school/ContactAcademic";
import GradingSystem from "@/features/setup/school/GradingSystem";
import RegionalPreferences from "@/features/setup/school/RegionalPreferences";
import SchoolSetupHeader from "@/features/setup/school/SchoolSetupHeader";
import WizardSidebar from "@/features/setup/school/WizardSidebar";
import WizardNavigation from "@/features/setup/school/WizardNavigation";
import StepReview from "@/features/setup/school/StepReview";

const STEPS = [
  {
    id: "identity",
    label: "School Identity",
    component: SchoolIdentity,
  },
  {
    id: "contact",
    label: "Contact & Academic",
    component: ContactAcademic,
  },
  {
    id: "grading",
    label: "Grading System",
    component: GradingSystem,
  },
  {
    id: "regional",
    label: "Regional Preferences",
    component: RegionalPreferences,
  },
  {
    id: "review",
    label: "Review & Confirm",
    component: StepReview,
  },
] as const;

export default function SchoolSetup() {
  const {
    form,
    updateField,
    gradingScale,
    updateGrade,
    addGrade,
    removeGrade,
    resetGradingScale,
    isDirty,
    progress,
    isSaving,
    isLoading,
    error,
    handleSave,
    handleDiscard,
    handleLogoUpload,
    handleRemoveLogo,
    fieldErrors,
  } = useSchoolSetup();

  const [currentStep, setCurrentStep] = useState(0);

  // ------------------------------------------------------------
  // Step validation
  // ------------------------------------------------------------

  const isStepValid = (stepIndex: number): boolean => {
    if (stepIndex === 0) {
      return !!form.name.trim();
    }

    if (stepIndex === 1) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

      return !!form.address.trim() && !!form.phone.trim() && emailValid;
    }

    return true;
  };

  const canGoNext = isStepValid(currentStep) && currentStep < STEPS.length - 1;

  const canGoPrevious = currentStep > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentStep((step) => step - 1);
    }
  };

  // ------------------------------------------------------------
  // Props shared with setup steps
  // ------------------------------------------------------------

  const stepProps = {
    form,
    updateField,
    gradingScale,
    updateGrade,
    addGrade,
    removeGrade,
    resetGradingScale,
    errors: fieldErrors,
    onLogoUpload: handleLogoUpload,
    onRemoveLogo: handleRemoveLogo,
    logoUrl: form.logoUrl,
  };

  const ActiveStepComponent = STEPS[currentStep].component;

  // ------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="min-h-full pb-12">
        <div className="flex min-h-70 items-center justify-center rounded-[30px] border border-slate-200/70 bg-white/80 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
              Loading school configuration
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Preparing your school setup...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // Error
  // ------------------------------------------------------------

  if (error) {
    return (
      <div className="min-h-full pb-12">
        <div className="rounded-[30px] border border-rose-200 bg-rose-50/80 p-6 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-rose-900/50 dark:bg-rose-950/30">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
              <AlertCircle size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-rose-800 dark:text-rose-200">
                Unable to load school configuration
              </p>

              <p className="mt-1 text-xs leading-5 text-rose-600 dark:text-rose-300">
                Something went wrong while loading the school setup. Please try
                again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 pb-12">
      {/* ========================================================
          HEADER
      ========================================================= */}

      <SchoolSetupHeader
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {/* ========================================================
          PROGRESS / STEPPER
      ========================================================= */}

      <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/80 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="p-4 sm:p-5">
          {/* Desktop stepper */}
          <div className="hidden lg:flex lg:items-center">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <div key={step.id} className="flex min-w-0 flex-1 items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`
                        flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-xl text-xs font-black transition-all duration-200
                        ${
                          isComplete
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : isActive
                              ? "bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 dark:bg-blue-950/40 dark:text-blue-300"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                        }
                      `}
                    >
                      {isComplete ? <Check size={15} /> : index + 1}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`
                          truncate text-xs font-bold
                          ${
                            isActive
                              ? "text-slate-950 dark:text-white"
                              : isComplete
                                ? "text-slate-600 dark:text-slate-300"
                                : "text-slate-400 dark:text-slate-500"
                          }
                        `}
                      >
                        {step.label}
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-400">
                        Step {index + 1}
                      </p>
                    </div>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`
                        mx-4 h-px flex-1 transition-colors duration-300
                        ${
                          index < currentStep
                            ? "bg-blue-500"
                            : "bg-slate-200 dark:bg-slate-800"
                        }
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile / tablet stepper */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/20">
                  {currentStep + 1}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                    {STEPS[currentStep].label}
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                    Step {currentStep + 1} of {STEPS.length}
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${Math.max(
                    5,
                    ((currentStep + 1) / STEPS.length) * 100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="self-start xl:sticky xl:top-24">
          <WizardSidebar form={form} gradingScale={gradingScale} />
        </aside>

        {/* Main */}
        <main className="min-w-0 space-y-5">
          {/* Current step container */}
          <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/80 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
            {/* Step header */}
            <div className="border-b border-slate-200/70 px-5 py-5 sm:px-7 dark:border-slate-800">
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                      Step {currentStep + 1}
                    </span>

                    {isDirty && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:bg-amber-950/30 dark:text-amber-300">
                        Unsaved changes
                      </span>
                    )}
                  </div>

                  <h2 className="truncate text-lg font-bold tracking-tight text-slate-950 dark:text-white sm:text-xl">
                    {STEPS[currentStep].label}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Configure this section of your school profile.
                  </p>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Setup Progress
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                    {Math.round(progress)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Step content */}
            <div className="p-5 sm:p-7">
              <ActiveStepComponent {...stepProps} />
            </div>
          </section>

          {/* Navigation */}
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={STEPS.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            isSaving={isSaving}
            onSave={handleSave}
            isDirty={isDirty}
          />
        </main>
      </div>
    </div>
  );
}
