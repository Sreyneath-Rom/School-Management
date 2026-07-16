import { useState, useCallback } from 'react';

interface FormState {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const useForm = <T extends FormState>(
  initialValues: T,
  onSubmit: (values: T) => void | Promise<void>,
  validate?: (values: T) => FormErrors
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<FormElement>) => {
    const { name, value, type } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear a field's error as soon as the user edits it — leaving a stale
    // error visible after the value has changed is confusing UX.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  }, []);

  // Widened to match handleChange: previously typed to HTMLInputElement
  // only, which was a type error for any <select> or <textarea> that used
  // this same handler on blur.
  const handleBlur = useCallback(
    (e: React.FocusEvent<FormElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validate) {
        setValues((currentValues) => {
          const fieldErrors = validate(currentValues);
          setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] ?? '' }));
          return currentValues;
        });
      }
    },
    [validate]
  );

  const handleReset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);
        const hasErrors = Object.values(validationErrors).some(Boolean);
        if (hasErrors) {
          setTouched(
            Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<string, boolean>)
          );
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, validate]
  );

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleReset,
    handleSubmit,
    setFieldValue,
    setFieldError,
  };
};