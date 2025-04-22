import React from "react";
import { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  theme?: "light" | "dark";
  "data-testid"?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, required, error, type = "text", id, theme = "light", ...rest }, ref) => {
    const reactId = useId();
    const inputId =
      id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}-${reactId}`;

    // Theme-based classes
    const baseLabelClass = theme === "dark" ? "text-gray-200" : "text-gray-700";
    
    const baseInputClass = theme === "dark"
      ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:border-blue-400 focus:ring-blue-400"
      : "bg-white text-gray-900 placeholder-gray-500 border-gray-200 focus:border-blue-500 focus:ring-blue-500";
    
    const errorBorder = "border-red-500";
    const commonStyles = "block w-full rounded-md py-2 px-3 shadow-sm border focus:outline-none focus:ring-1 focus:ring-inset";
    
    const inputClasses = `${commonStyles} ${error ? errorBorder : baseInputClass}`;
    
    const checkboxClasses = `h-4 w-4 ${
      theme === "dark" 
        ? "bg-gray-700 border-gray-500 text-blue-400" 
        : "border-gray-300 text-blue-600"
    } focus:ring-blue-500 ${error ? errorBorder : ""}`;

    return (
      <div className="space-y-1">
        {(type !== "checkbox" && type !== "radio" && type !== "date") && label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium ${baseLabelClass}`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {type === "checkbox" || type === "radio" ? (
          <div className="flex items-center gap-2">
            <input
              ref={ref}
              id={inputId}
              type={type}
              {...rest}
              className={checkboxClasses}
            />
            <label
              htmlFor={inputId}
              className={`text-sm ${baseLabelClass}`}
            >
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          </div>
        ) : (
          <input
            ref={ref}
            id={inputId}
            type={type}
            {...rest}
            className={inputClasses}
          />
        )}

        {error && (
          <p className={`mt-1 text-sm ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";