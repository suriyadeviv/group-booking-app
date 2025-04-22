'use client';

import { AccordionTheme, AccordionStyleClasses, AccordionSectionProps } from "@/types/accordion-types";


const getThemeClasses = (theme: AccordionTheme): AccordionStyleClasses => ({
  borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
  textColor: theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
  hoverBg: theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
  contentBg: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
  dividerColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
});

export default function AccordionSection({
  id,
  title,
  children,
  isFirst = false,
  isLast = false,
  isActive,
  onToggle,
  theme = 'light'
}: AccordionSectionProps) {
  const {
    borderColor,
    textColor,
    hoverBg,
    contentBg,
    dividerColor
  } = getThemeClasses(theme);

  return (
    <div className={`border ${borderColor} ${contentBg} ${
      isFirst ? 'rounded-t-xl' : ''
    } ${
      isLast ? 'rounded-b-xl' : ''
    } ${
      !isLast ? 'mb-4' : ''
    }`}>
      <h2 id={`accordion-heading-${id}`}>
        <button
          type="button"
          className={`flex items-center justify-between w-full p-5 font-medium text-left ${textColor} ${hoverBg} gap-3 transition-colors ${
            !isActive ? 'border-b-0' : ''
          }`}
          onClick={onToggle}
          aria-expanded={isActive}
          aria-controls={`accordion-body-${id}`}
        >
          <span>{title}</span>
          <svg
            className={`w-3 h-3 shrink-0 ${isActive ? 'rotate-180' : ''}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id={`accordion-body-${id}`}
        className={`${isActive ? 'block' : 'hidden'} ${
          !isLast ? `border-b ${dividerColor}` : ''
        }`}
        data-testid="accordion-content"
        aria-labelledby={`accordion-heading-${id}`}
      >
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}