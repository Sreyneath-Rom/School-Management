// src/features/setup/school/WizardNavigation.tsx

import Button from '@/components/common/Button';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

interface Props {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isSaving: boolean;
  onSave: () => void;
  isDirty: boolean;
}

export default function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isSaving,
  onSave,
  isDirty,
}: Props) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div
      className="
        glass-sm
        relative
        overflow-hidden
        rounded-3xl
        p-4
        sm:p-5
      "
    >
      {/* Ambient glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-16
          -bottom-20
          h-40
          w-40
          rounded-full
          bg-brand-400/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-20
          h-40
          w-40
          rounded-full
          bg-orange-400/10
          blur-3xl
        "
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* =====================================================
            STEP INDICATOR
        ====================================================== */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              min-w-9
              items-center
              justify-center
              rounded-xl
              bg-slate-100/80
              px-2.5
              text-xs
              font-bold
              text-slate-600
              shadow-sm
              dark:bg-slate-800/60
              dark:text-slate-300
            "
          >
            {currentStep + 1}
            <span className="mx-1 text-slate-400">/</span>
            {totalSteps}
          </div>

          <div className="hidden h-5 w-px bg-slate-200 sm:block dark:bg-slate-700" />

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isLastStep ? 'Ready to save' : 'Continue setup'}
          </p>
        </div>

        {/* =====================================================
            ACTIONS
        ====================================================== */}
        <div className="flex w-full gap-2 sm:w-auto">
          {/* Previous */}
          <Button
            variant="glass"
            onClick={onPrevious}
            disabled={!canGoPrevious || isSaving}
            className="
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              px-4
              py-2.5
              font-semibold
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-lg
              active:translate-y-0
              disabled:cursor-not-allowed
              disabled:opacity-40
              sm:flex-none
            "
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </Button>

          {/* Next */}
          {!isLastStep && (
            <Button
              variant="solid"
              onClick={onNext}
              disabled={!canGoNext || isSaving}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-brand-600
                px-5
                py-2.5
                font-bold
                text-white
                shadow-[0_8px_20px_rgba(15,163,179,0.22)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-brand-700
                hover:shadow-[0_10px_24px_rgba(15,163,179,0.32)]
                active:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:shadow-none
                sm:flex-none
              "
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </Button>
          )}

          {/* Save */}
          {isLastStep && (
            <Button
              variant="solid"
              onClick={onSave}
              disabled={isSaving || !isDirty}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-brand-600
                px-5
                py-2.5
                font-bold
                text-white
                shadow-[0_8px_20px_rgba(15,163,179,0.22)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-brand-700
                hover:shadow-[0_10px_24px_rgba(15,163,179,0.32)]
                active:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:shadow-none
                sm:flex-none
              "
            >
              {isSaving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-8
          right-8
          h-px
          bg-linear-to-r
          from-transparent
          via-brand-400/30
          to-transparent
        "
      />
    </div>
  );
}