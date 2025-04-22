import { render, renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

describe('ThemeContext', () => {
  // Clear localStorage and reset mocks between tests
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('ThemeProvider', () => {
    it('should provide light theme by default', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('light');
    });

    it('should load theme from localStorage on mount', () => {
      localStorage.setItem('theme', 'dark');
      
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should ignore invalid theme in localStorage', () => {
      localStorage.setItem('theme', 'invalid-theme');
      
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('light');
    });

    it('should toggle theme between light and dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      // Initial state
      expect(result.current.theme).toBe('light');
      expect(localStorage.getItem('theme')).toBeNull();

      // First toggle
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');

      // Second toggle
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should set specific theme', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      // Set to dark
      act(() => {
        result.current.setTheme('dark');
      });
      expect(result.current.theme).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');

      // Set back to light
      act(() => {
        result.current.setTheme('light');
      });
      expect(result.current.theme).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('useTheme', () => {
    it('should throw error when used outside ThemeProvider', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');
    });

    it('should provide theme context to children', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme-display">{theme}</div>;
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-display').textContent).toBe('light');
    });
  });

  describe('localStorage integration', () => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };

    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
    });

    it('should call localStorage.getItem on mount', () => {
      renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    it('should call localStorage.setItem when theme changes', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });
});