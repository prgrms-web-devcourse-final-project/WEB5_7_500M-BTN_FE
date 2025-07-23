import { useState, useEffect, useCallback } from "react";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/utils";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // 초기값 설정
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getLocalStorage<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 로컬 스토리지에 값 저장
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        setLocalStorage(key, valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // 로컬 스토리지에서 값 제거
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      removeLocalStorage(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // 다른 탭에서의 변경사항 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue] as const;
};

// 특정 타입별 로컬 스토리지 훅들
export const useLocalStorageString = (
  key: string,
  initialValue: string = ""
) => {
  return useLocalStorage<string>(key, initialValue);
};

export const useLocalStorageNumber = (
  key: string,
  initialValue: number = 0
) => {
  return useLocalStorage<number>(key, initialValue);
};

export const useLocalStorageBoolean = (
  key: string,
  initialValue: boolean = false
) => {
  return useLocalStorage<boolean>(key, initialValue);
};

export const useLocalStorageArray = <T>(
  key: string,
  initialValue: T[] = []
) => {
  return useLocalStorage<T[]>(key, initialValue);
};

export const useLocalStorageObject = <T extends Record<string, any>>(
  key: string,
  initialValue: T
) => {
  return useLocalStorage<T>(key, initialValue);
};
