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
import LogoUploader from "@/features/setup/school/LogoUploader";
import StepReview from "@/features/setup/school/StepReview";

const STEPS = [
  { id: "identity", label: "School Identity",       component: SchoolIdentity },
  { id: "logo",     label: "Upload Logo",           component: LogoUploader },
  { id: "contact",  label: "Contact & Academic",    component: ContactAcademic },
  { id: "grading",  label: "Grading System",        component: GradingSystem },
  { id: "regional", label: "Regional Preferences",  component: RegionalPreferences },
  { id: "review",   label: "Review & Confirm",      component: StepReview },
] as const;

/* Neumorphic hairline seam (bottom edge). */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'

export default function SchoolSetup() {
  const {
    form, updateField,
    gradingScale, updateGrade, addGrade, removeGrade, resetGradingScale,
    isDirty, progress, isSaving, isLoading, error,
    handleSave, handleDiscard,
    handleLogoUpload, handleRemoveLogo,
    fieldErrors,
  } = useSchoolSetup();

  const [currentStep, setCurrentStep] = useState(0);

  const isStepValid = (stepIndex: number): boolean => {
    if (stepIndex === 0) return !!form.name.trim();
    if (stepIndex === 1) {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      return !!form.address.trim() && !!form.phone.trim() && emailValid;
    }
    return true;
  };

  const canGoNext = isStepValid(currentStep) && currentStep < STEPS.length - 1;
  const canGoPrevious = currentStep > 0;

  const handleNext = () => { if (canGoNext) setCurrentStep((step) => step + 1); };
  const handlePrevious = () => { if (canGoPrevious) setCurrentStep((step) => step - 1); };

  const stepProps = {
    form, updateField, gradingScale, updateGrade, addGrade, removeGrade, resetGradingScale,
    errors: fieldErrors,
    onUpload: handleLogoUpload,
    onRemove: handleRemoveLogo,
    logoUrl: form.logoUrl,
  };

  const ActiveStepComponent = STEPS[currentStep].component;

  // ------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-full pb-12">
        <div className="flex min-h-70 items-center justify-center rounded-[30px] glass-sm text-fg">
          <div className="flex flex-col items-center text-center">
            {/* Spinner well — sunken, brand-tinted */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 shadow-sunken">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500/25 border-t-brand-600 dark:border-t-brand-400" />
            </div>
            <p className="mt-4 text-sm font-bold text-fg">Loading school configuration</p>
            <p className="mt-1 text-xs text-fg-muted">Preparing your school setup...</p>
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
        <div className="rounded-[30px] glass-strong p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error/15 text-error shadow-sunken">
              <AlertCircle size={19} />
            </div>
            <div>
              <p className="text-sm font-bold text-error">Unable to load school configuration</p>
              <p className="mt-1 text-xs leading-5 text-error/80">
                Something went wrong while loading the school setup. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 pb-12">
      <SchoolSetupHeader
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {/* ========================================================
          STEPPER
      ======================================================== */}
      <section className="overflow-hidden rounded-[28px] glass-sm">
        <div className="p-4 sm:p-5">
          {/* Desktop stepper */}
          <div className="hidden md:flex md:items-center">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <div key={step.id} className="flex min-w-0 flex-1 items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (index <= currentStep || isStepValid(currentStep)) {
                        setCurrentStep(index);
                      }
                    }}
                    className="flex min-w-0 items-center gap-3 text-left transition-all hover:opacity-90 cursor-pointer"
                  >
                    {/* Step circle:
                        - complete → filled brand chip
                        - active   → filled brand chip + brand ring
                        - else     → sunken well with muted number */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all duration-200 ${
                        isComplete
                          ? "bg-brand-600 text-white"
                          : isActive
                            ? "bg-brand-600 text-white ring-2 ring-brand-500/30"
                            : "text-fg-muted shadow-sunken"
                      }`}
                    >
                      {isComplete ? <Check size={16} strokeWidth={2.5} /> : index + 1}
                    </div>

                    <div className="min-w-0 pr-1">
                      <p
                        className={`truncate text-xs font-bold ${
                          isActive
                            ? "text-fg"
                            : isComplete
                              ? "text-fg-muted"
                              : "text-fg-muted/60"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-fg-muted/60">Step {index + 1}</p>
                    </div>
                  </button>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`mx-3 h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                        index < currentStep ? "bg-brand-500" : "bg-fg-muted/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile stepper */}
          <div className="md:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-black text-white">
                  {currentStep + 1}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-fg">
                    {STEPS[currentStep].label}
                  </p>
                  <p className="text-[11px] text-fg-muted">
                    Step {currentStep + 1} of {STEPS.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Progress track: sunken well */}
            <div className="mt-3.5 h-2 overflow-hidden rounded-full shadow-sunken">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-300"
                style={{ width: `${Math.max(6, ((currentStep + 1) / STEPS.length) * 100)}%` }}
              />
            </div>

            {/* Mobile step chips */}
            <div className="mt-3.5 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    if (idx <= currentStep || isStepValid(currentStep)) {
                      setCurrentStep(idx);
                    }
                  }}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                    idx === currentStep
                      ? "bg-brand-600 text-white shadow-sunken"
                      : idx < currentStep
                        ? "text-fg-muted shadow-sunken"
                        : "text-fg-muted/60 shadow-sunken"
                  }`}
                >
                  {idx + 1}. {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN
      ======================================================== */}
      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="self-start xl:sticky xl:top-24">
          <WizardSidebar form={form} gradingScale={gradingScale} />
        </aside>

        <main className="min-w-0 space-y-5">
          <section className="overflow-hidden rounded-[30px] glass-strong">
            <div className={`px-5 py-5 sm:px-7 ${SEAM_B}`}>
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                      Step {currentStep + 1}
                    </span>
                    {isDirty && (
                      <span className="rounded-full bg-warning/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-warning">
                        Unsaved changes
                      </span>
                    )}
                  </div>
                  <h2 className="truncate text-lg font-bold tracking-tight text-fg sm:text-xl">
                    {STEPS[currentStep].label}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-fg-muted">
                    Configure this section of your school profile.
                  </p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-fg-muted/60">
                    Setup Progress
                  </p>
                  <p className="mt-1 text-lg font-black text-fg">{Math.round(progress)}%</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <ActiveStepComponent {...stepProps} />
            </div>
          </section>

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