import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en-GB', 'de-DE'],
 
  // Used when no locale matches
  defaultLocale: 'en-GB'
});

export type Locale = (typeof routing.locales)[number];