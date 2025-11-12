import { useState, useEffect } from "react";

const SelectGroupTwo = ({ value, onChange, options, placeholder }) => {
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  useEffect(() => {
    // Check if there is a value selected on initial render
    if (value) {
      setIsOptionSelected(true);
    }
  }, [value]);

  const handleChange = (e) => {
    // Make sure e.target is valid and value exists
    if (e && e.target) {
      const selectedValue = e.target.value;
      onChange(selectedValue);
      setIsOptionSelected(selectedValue !== ""); // Update state if an option is selected
    }
  };

  return (
    <div>
      <div className="relative z-20 bg-white dark:bg-form-input">
        <span className="absolute top-1/2 left-8 z-30 -translate-y-1/2">
          <i className="fa-solid fa-list"></i>
        </span>
        <select
          value={value}
          onChange={handleChange}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? "text-black dark:text-white" : ""}`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-body dark:text-bodydark"
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <i className="fa-solid fa-chevron-down"></i>
        </span>
      </div>
    </div>
  );
};

export default SelectGroupTwo;
