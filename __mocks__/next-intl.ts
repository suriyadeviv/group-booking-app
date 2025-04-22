export const useTranslations = jest.fn(() => (key: string) => key);
export const useLocale = jest.fn(() => 'en-GB');
export const NextIntlClientProvider = ({ children }: { children: React.ReactNode }) => children;
