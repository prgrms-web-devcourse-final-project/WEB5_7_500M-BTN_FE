import { useState, useCallback, useMemo } from "react";
import { validateEmail, validatePassword, validatePhoneNumber } from "@/utils";

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
}

// 필드 검증 함수를 외부로 이동
const validateField = (
  field: string,
  value: any,
  rules: ValidationRule
): string | null => {
  if (rules.required && (!value || value.toString().trim() === "")) {
    return "이 필드는 필수입니다.";
  }

  if (value && rules.minLength && value.toString().length < rules.minLength) {
    return `최소 ${rules.minLength}자 이상 입력해주세요.`;
  }

  if (value && rules.maxLength && value.toString().length > rules.maxLength) {
    return `최대 ${rules.maxLength}자까지 입력 가능합니다.`;
  }

  if (value && rules.pattern && !rules.pattern.test(value.toString())) {
    return "올바른 형식으로 입력해주세요.";
  }

  if (value && rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // 필드 값 변경
  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // 터치된 필드로 표시
      setTouched((prev) => ({ ...prev, [field]: true }));

      // 실시간 검증
      if (validationRules?.[field as string]) {
        const fieldError = validateField(
          field as string,
          value,
          validationRules[field as string]
        );
        setErrors((prev) => ({
          ...prev,
          [field]: fieldError || undefined,
        }));
      }
    },
    [validationRules]
  );

  // 필드 터치
  const setFieldTouched = useCallback(
    (field: keyof T, touched: boolean = true) => {
      setTouched((prev) => ({ ...prev, [field]: touched }));
    },
    []
  );

  // 폼 리셋
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // 전체 폼 검증
  const validateForm = useCallback(() => {
    if (!validationRules) return true;

    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const fieldError = validateField(
        field,
        values[field],
        validationRules[field]
      );
      if (fieldError) {
        newErrors[field as keyof T] = fieldError;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  // 폼 제출
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => {
      return async (e?: React.FormEvent) => {
        if (e) {
          e.preventDefault();
        }

        const isValid = validateForm();
        if (!isValid) {
          return;
        }

        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        }
      };
    },
    [values, validateForm]
  );

  // 계산된 값들
  const isValid = useMemo(() => {
    if (!validationRules) return true;

    // 검증 규칙이 있는 필드들만 확인
    const fieldsWithRules = Object.keys(validationRules);

    // 모든 필드가 유효한지 확인
    for (const field of fieldsWithRules) {
      const fieldError = validateField(
        field,
        values[field],
        validationRules[field]
      );
      if (fieldError) {
        return false;
      }
    }

    return true;
  }, [values, validationRules]);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  const formState: FormState<T> = {
    values,
    errors,
    touched,
    isValid,
    isDirty,
  };

  return {
    ...formState,
    setFieldValue,
    setFieldTouched,
    resetForm,
    validateForm,
    handleSubmit,
  };
};

// 특정 검증 규칙들
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!validateEmail(value)) {
        return "올바른 이메일 형식이 아닙니다.";
      }
      return null;
    },
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        return validation.errors[0];
      }
      return null;
    },
  },
  phoneNumber: {
    required: true,
    custom: (value: string) => {
      if (!validatePhoneNumber(value)) {
        return "올바른 전화번호 형식이 아닙니다.";
      }
      return null;
    },
  },
  nickname: {
    required: true,
    minLength: 2,
    maxLength: 20,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  age: {
    required: true,
    custom: (value: number) => {
      if (value < 18 || value > 100) {
        return "나이는 18세 이상 100세 이하여야 합니다.";
      }
      return null;
    },
  },
};
