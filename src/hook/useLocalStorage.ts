import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function useLocalStorage(key, initialValue) {
  // Validate prop types (optional but recommended)
  useLocalStorage.propTypes = {
    key: PropTypes.string.isRequired,
    initialValue: PropTypes.any, // Can be any type
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error); // Use console.error for errors
      return initialValue;
    }
  });

  // useEffect to update local storage when the state changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === "function"
          ? storedValue(storedValue)
          : storedValue;
      // Save state
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error); // Use console.error for errors
    }
  }, [key, storedValue]);

  // Return a function that correctly updates the state
  const setValue = (value) => {
    setStoredValue((prevValue) => {
      const valueToStore =
        typeof value === "function" ? value(prevValue) : value;
      return valueToStore;
    });
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
