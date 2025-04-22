// accordion-types.ts
import { ReactNode } from 'react';

export type AccordionTheme = 'light' | 'dark';
export type AccordionID = string;

export interface AccordionSectionProps {
  id: AccordionID;
  title: string;
  children: ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  isActive: boolean;
  onToggle: () => void;
  theme?: AccordionTheme;
}

export interface AccordionStyleClasses {
  borderColor: string;
  textColor: string;
  hoverBg: string;
  contentBg: string;
  dividerColor: string;
}