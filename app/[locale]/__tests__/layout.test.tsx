import React from 'react';
import { render } from '@testing-library/react';
import LocaleLayout from '../layout'; 
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

jest.mock('next-intl', () => ({
  hasLocale: jest.fn(),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

jest.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en-GB', 'de-DE']
  }
}));

jest.mock('@/context/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('LocaleLayout', () => {
  it('renders correctly for valid locale', async () => {
    const { hasLocale } = require('next-intl');
    hasLocale.mockReturnValue(true);

    const params = Promise.resolve({ locale: 'en-GB' });

    const layout = await LocaleLayout({
      children: <div data-testid="child">Test Child</div>,
      params
    });

    const { getByTestId } = render(layout);

    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('calls notFound for invalid locale', async () => {
    const { hasLocale } = require('next-intl');
    const { notFound } = require('next/navigation');

    hasLocale.mockReturnValue(false);

    const params = Promise.resolve({ locale: 'xx' });

    await LocaleLayout({
      children: <div>Invalid</div>,
      params
    });

    expect(notFound).toHaveBeenCalled();
  });
});
