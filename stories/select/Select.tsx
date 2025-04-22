import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  selectId?: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  theme?: 'light' | 'dark';
}

const Select: React.FC<SelectProps> = React.memo(
  ({ label, options, error, required, selectId, theme = 'light', onChange, ...rest }) => {
    // Theme-based classes
    const labelClass = theme === "dark" ? "text-gray-200" : "text-gray-700";
    const errorClass = theme === 'dark' ? 'text-red-400' : 'text-red-600';
    
    const baseClasses = 'block w-full min-w-0 sm:min-w-[280px] max-w-full rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1';
    const borderColor = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : theme === 'dark'
        ? 'border-gray-600 focus:border-blue-400 focus:ring-blue-400'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    const themeClasses = theme === 'dark'
      ? 'bg-gray-800 text-white placeholder-gray-400'
      : 'bg-white text-gray-900';

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={selectId} className={`block text-m font-medium ${labelClass}`}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          id={selectId}
          data-testid={selectId}
          onChange={onChange}
          {...rest}
          className={`${baseClasses} ${borderColor} ${themeClasses}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className={`mt-1 text-sm ${errorClass}`}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;