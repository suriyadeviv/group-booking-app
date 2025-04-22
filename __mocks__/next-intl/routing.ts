// __mocks__/next-intl/routing.ts
const mockDefineRouting = jest.fn(() => ({
    locales: ['en-GB', 'de-DE'],
    defaultLocale: 'en-GB',
    localePrefix: 'as-needed',
  }));
  
  export const defineRouting = mockDefineRouting;
  export default mockDefineRouting;