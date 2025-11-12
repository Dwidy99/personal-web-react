import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error("useLocalStorage get error:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("useLocalStorage set error:", error);
    }
  }, [key, storedValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prevValue) =>
      value instanceof Function ? value(prevValue) : value
    );
  };

  return [storedValue, setValue];
}
