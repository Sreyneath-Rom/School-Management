// src/hooks/useSchoolSetup.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  schoolService,
  type SchoolModel,
  type SchoolPayload,
} from '@/services/schoolService';
import { useToast } from '@/components/common/ToastProvider';
import type { GradeScale } from '@/types/school';

// Augment the SchoolSettings interface to include gradingScale
declare module '@/services/schoolService' {
  interface SchoolSettings {
    gradingScale?: GradeScale[];
  }
}

// ---- Constants & Defaults ----
const defaultForm = {
  name: '',
  schoolCode: '',
  logoUrl: '',
  motto: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  academicYear: '',
  academicTerm: '',
  language: 'English',
  timeZone: '(GMT+00:00) London',
  dateFormat: 'DD/MM/YYYY',
};

type SchoolFormState = typeof defaultForm;
type FieldErrors = Partial<Record<keyof SchoolFormState, string>>;

const PROGRESS_FIELDS: (keyof SchoolFormState)[] = [
  'name', 'schoolCode', 'logoUrl', 'motto', 'description',
  'address', 'phone', 'email', 'website', 'academicYear', 'academicTerm',
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const DEFAULT_GRADING_SCALE: GradeScale[] = [
  { id: 'grade-a', grade: 'A', minScore: 90, maxScore: 100, point: 4.0, description: 'Excellent', passing: true },
  { id: 'grade-b', grade: 'B', minScore: 80, maxScore: 89,  point: 3.0, description: 'Good', passing: true },
  { id: 'grade-c', grade: 'C', minScore: 70, maxScore: 79,  point: 2.0, description: 'Average', passing: true },
  { id: 'grade-d', grade: 'D', minScore: 50, maxScore: 69,  point: 1.0, description: 'Below average/passing', passing: true },
  { id: 'grade-f', grade: 'F', minScore: 0,  maxScore: 49,  point: 0.0, description: 'Failing', passing: false },
];

// ---- Helper ----
function buildFormFromSchool(school: SchoolModel, prev: SchoolFormState): SchoolFormState {
  return {
    ...prev,
    name: school.name,
    schoolCode: school.settings?.schoolCode ?? prev.schoolCode,
    logoUrl: school.logoUrl ?? '',
    motto: school.settings?.motto ?? prev.motto,
    description: school.settings?.description ?? prev.description,
    address: school.address ?? '',
    phone: school.phone ?? '',
    email: school.email ?? '',
    website: school.settings?.website ?? prev.website,
    academicYear: school.academicYear,
    academicTerm: school.settings?.academicTerm ?? prev.academicTerm,
    language: school.settings?.language ?? prev.language,
    timeZone: school.settings?.timeZone ?? prev.timeZone,
    dateFormat: school.settings?.dateFormat ?? prev.dateFormat,
  };
}

// ---- Hook ----
export function useSchoolSetup() {
  const { addToast } = useToast();
  const { school, loading, error, refetch } = useSchool();

  const [form, setForm] = useState<SchoolFormState>({ ...defaultForm });
  const [savedSnapshot, setSavedSnapshot] = useState<SchoolFormState>({ ...defaultForm });
  const [gradingScale, setGradingScale] = useState<GradeScale[]>(DEFAULT_GRADING_SCALE);
  const [savedGradingScale, setSavedGradingScale] = useState<GradeScale[]>(DEFAULT_GRADING_SCALE);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // ---- Load school data ----
  useEffect(() => {
    if (!school) return;
    const next = buildFormFromSchool(school, form);
    setForm(next);
    setSavedSnapshot(next);

    const savedScale = school.settings?.gradingScale;
    if (Array.isArray(savedScale) && savedScale.length > 0) {
      setGradingScale(savedScale as GradeScale[]);
      setSavedGradingScale(savedScale as GradeScale[]);
    } else {
      setGradingScale(DEFAULT_GRADING_SCALE);
      setSavedGradingScale(DEFAULT_GRADING_SCALE);
    }
  }, [school]);

  // ---- Computed ----
  const isDirty = useMemo(
    () =>
      JSON.stringify(form) !== JSON.stringify(savedSnapshot) ||
      JSON.stringify(gradingScale) !== JSON.stringify(savedGradingScale),
    [form, savedSnapshot, gradingScale, savedGradingScale]
  );

  const progress = useMemo(() => {
    const filled = PROGRESS_FIELDS.filter((field) => form[field]?.trim().length > 0).length;
    return Math.round((filled / PROGRESS_FIELDS.length) * 100);
  }, [form]);

  // ---- Field update ----
  const updateField = useCallback((field: keyof SchoolFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [fieldErrors]);

  // ---- Grading scale operations ----
  const updateGrade = useCallback((id: string, field: keyof GradeScale, value: string | number | boolean) => {
    setGradingScale((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }, []);

  const addGrade = useCallback(() => {
    const newGrade: GradeScale = {
      id: `grade-${Date.now()}`,
      grade: 'E',
      minScore: 50,
      maxScore: 59,
      point: 0,
      description: 'Custom Grade',
      passing: true,
    };
    setGradingScale((prev) => [...prev, newGrade]);
  }, []);

  const removeGrade = useCallback(
    (id: string) => {
      if (gradingScale.length <= 1) {
        addToast('error', 'At least one grading level is required.');
        return;
      }
      setGradingScale((prev) => prev.filter((item) => item.id !== id));
    },
    [gradingScale.length, addToast]
  );

  const resetGradingScale = useCallback(() => {
    setGradingScale(DEFAULT_GRADING_SCALE);
  }, []);

  // ---- Validation ----
  const validate = useCallback((): FieldErrors => {
    const errors: FieldErrors = {};
    if (!form.name.trim()) errors.name = 'School name is required.';
    if (!form.academicYear.trim()) errors.academicYear = 'Academic year is required.';
    if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (form.website.trim() && !/^https?:\/\/.+\..+/.test(form.website.trim())) {
      errors.website = 'Include the full URL, e.g. https://yourschool.edu';
    }
    return errors;
  }, [form]);

  const validateGradingScale = useCallback((): string | null => {
    if (gradingScale.length === 0) return 'At least one grade is required.';

    // Sort by minScore so we only need to compare each row to its
    // immediate neighbor for overlaps, rather than every pair.
    const sorted = [...gradingScale].sort((a, b) => a.minScore - b.minScore);

    for (let i = 0; i < sorted.length; i += 1) {
      const grade = sorted[i];
      if (!grade.grade.trim()) return 'Every grading row needs a grade.';
      if (grade.minScore < 0 || grade.maxScore > 100) return 'Scores must be between 0 and 100.';
      if (grade.minScore > grade.maxScore) return `Invalid score range for grade ${grade.grade}.`;
      if (grade.point < 0) return `Invalid GPA point for grade ${grade.grade}.`;

      // `getGradeForScore` in GradingSystem picks the FIRST matching row
      // via `.find()` — without this check, two overlapping bands would
      // silently produce inconsistent grading depending on array order,
      // with no error to catch it.
      const next = sorted[i + 1];
      if (next && grade.maxScore >= next.minScore) {
        return `Grade ${grade.grade} (${grade.minScore}-${grade.maxScore}) overlaps with grade ${next.grade} (${next.minScore}-${next.maxScore}).`;
      }
    }
    return null;
  }, [gradingScale]);

  // ---- Logo handlers ----
  const handleLogoUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        addToast('error', 'Please choose an image file for the logo.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast('error', 'Logo image must be under 5MB.');
        return;
      }
      setIsUploadingLogo(true);
      try {
        const updated = await schoolService.uploadLogo(file);
        const merged = buildFormFromSchool(updated, form);
        setForm(merged);
        setSavedSnapshot(merged);
        addToast('success', 'Logo uploaded successfully.');
        refetch?.();
      } catch {
        addToast('error', 'Unable to upload logo. Please try again.');
      } finally {
        setIsUploadingLogo(false);
      }
    },
    [form, addToast, refetch]
  );

  const handleRemoveLogo = useCallback(async () => {
    setIsUploadingLogo(true);
    try {
      const updated = await schoolService.removeLogo();
      const merged = buildFormFromSchool(updated, form);
      setForm(merged);
      setSavedSnapshot(merged);
      addToast('success', 'Logo removed successfully.');
      refetch?.();
    } catch {
      addToast('error', 'Unable to remove logo. Please try again.');
    } finally {
      setIsUploadingLogo(false);
    }
  }, [form, addToast, refetch]);

  // ---- Save / Discard ----
  const handleDiscard = useCallback(() => {
    setForm(savedSnapshot);
    setGradingScale(savedGradingScale);
    setFieldErrors({});
  }, [savedSnapshot, savedGradingScale]);

  const handleSave = useCallback(async () => {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      addToast('error', 'Please fix the highlighted fields before saving.');
      return;
    }
    const gradingError = validateGradingScale();
    if (gradingError) {
      addToast('error', gradingError);
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<SchoolPayload> = {
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim() || null,
        address: form.address.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        academicYear: form.academicYear.trim(),
        settings: {
          schoolCode: form.schoolCode.trim() || undefined,
          academicTerm: form.academicTerm.trim() || undefined,
          motto: form.motto.trim() || undefined,
          description: form.description.trim() || undefined,
          website: form.website.trim() || undefined,
          language: form.language,
          timeZone: form.timeZone,
          dateFormat: form.dateFormat,
          gradingScale,
        },
      };

      const updated = await schoolService.saveSchool(payload);
      const merged = buildFormFromSchool(updated, form);
      setForm(merged);
      setSavedSnapshot(merged);

      const updatedScale = updated.settings?.gradingScale;
      const finalScale =
        Array.isArray(updatedScale) && updatedScale.length > 0
          ? (updatedScale as GradeScale[])
          : gradingScale;
      setGradingScale(finalScale);
      setSavedGradingScale(finalScale);

      addToast('success', 'School settings updated successfully.');
      refetch?.();
    } catch {
      addToast('error', 'Unable to save school settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [form, gradingScale, validate, validateGradingScale, addToast, refetch]);

  return {
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
    isLoading: loading,
    error,
    handleSave,
    handleDiscard,
    handleLogoUpload,
    handleRemoveLogo,
    fieldErrors,
    isUploadingLogo,
  };
}