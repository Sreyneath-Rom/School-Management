// src/pages/setup/SchoolSetup.tsx
import { AlertCircle } from 'lucide-react';
import { useSchoolSetup } from '@/hooks/useSchoolSetup';
import SchoolSetupHeader from '@/features/setup/school/SchoolSetupHeader';
import SchoolIdentity from '@/features/setup/school/SchoolIdentity';
import ContactAcademic from '@/features/setup/school/ContactAcademic';
import GradingSystem from '@/features/setup/school/GradingSystem';
import RegionalPreferences from '@/features/setup/school/RegionalPreferences';
import SchoolProfileCard from '@/features/setup/school/SchoolProfileCard';
import LogoUploader from '@/features/setup/school/LogoUploader';
import SetupProgress from '@/features/setup/school/SetupProgress';
import GradingSummary from '@/features/setup/school/GradingSummary';
import SetupTip from '@/features/setup/school/SetupTip';

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

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl glass-sm p-5 text-sm text-slate-600 dark:text-slate-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
        Loading school configuration...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
        <AlertCircle size={18} />
        Unable to load school configuration.
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 pb-10">
      <SchoolSetupHeader
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-6">
          <SchoolIdentity form={form} updateField={updateField} errors={fieldErrors} />
          <ContactAcademic form={form} updateField={updateField} errors={fieldErrors} />
          <GradingSystem
            gradingScale={gradingScale}
            updateGrade={updateGrade}
            addGrade={addGrade}
            removeGrade={removeGrade}
            resetGradingScale={resetGradingScale}
          />
          <RegionalPreferences form={form} updateField={updateField} />
        </main>
        <aside className="space-y-6">
          <SchoolProfileCard form={form} />
          <LogoUploader logoUrl={form.logoUrl} onUpload={handleLogoUpload} onRemove={handleRemoveLogo} />
          <SetupProgress progress={progress} />
          <GradingSummary gradingScale={gradingScale} />
          <SetupTip />
        </aside>
      </div>
    </div>
  );
}