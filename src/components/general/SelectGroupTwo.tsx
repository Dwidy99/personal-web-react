import { useState, useEffect, ChangeEvent } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectGroupTwoProps {
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function SelectGroupTwo({
  value,
  onChange,
  options,
  placeholder = "-- Select --",
}: SelectGroupTwoProps): JSX.Element {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  useEffect(() => {
    if (value) setIsOptionSelected(true);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
    setIsOptionSelected(selectedValue !== "");
  };

  return (
    <div>
      <div className="relative z-20 bg-white dark:bg-form-input">
        {/* Icon kiri */}
        <span className="absolute top-1/2 left-8 z-30 -translate-y-1/2">
          <i className="fa-solid fa-list"></i>
        </span>

        {/* Select utama */}
        <select
          value={value}
          onChange={handleChange}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
            isOptionSelected ? "text-black dark:text-white" : ""
          }`}
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

        {/* Icon kanan */}
        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <i className="fa-solid fa-chevron-down"></i>
        </span>
      </div>
    </div>
  );
}
