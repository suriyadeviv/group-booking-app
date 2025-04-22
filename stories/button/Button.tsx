import React from 'react';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use (will override default if provided) */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Theme mode */
  theme?: 'light' | 'dark';
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  name?: string; 
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  theme = 'light',
  type = 'button',
  name,
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-semibold rounded focus:outline-none transition-colors duration-200 w-full';

  const sizeClasses = {
    small: 'text-sm px-3 py-1.5',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-5 py-3'
  };

  const themeClasses = {
    light: primary
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100',
    dark: primary
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
  };

  return (
    <button
    role='button'
      type={type}
      name={name}
      className={`${baseClasses} ${sizeClasses[size]} ${themeClasses[theme]}`}
      style={backgroundColor ? { backgroundColor } : undefined}
      {...props}
    >
      {label}
    </button>
  );
};