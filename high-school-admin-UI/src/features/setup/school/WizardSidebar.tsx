// src/features/setup/school/WizardSidebar.tsx

import SchoolProfileCard from './SchoolProfileCard';
import GradingSummary from './GradingSummary';
import SetupTip from './SetupTip';

import type { SchoolFormState, GradeScale } from '@/types/school';

interface Props {
  form: SchoolFormState;
  gradingScale: GradeScale[];
}

export default function WizardSidebar({ form, gradingScale }: Props) {
  return (
    <aside className="space-y-4">
      <SchoolProfileCard form={form} />
      <GradingSummary gradingScale={gradingScale} />
      <SetupTip />
    </aside>
  );
}