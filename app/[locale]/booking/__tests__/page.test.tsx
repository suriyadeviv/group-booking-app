import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { ThemeProvider } from "@/context/ThemeContext";
import BookingPage from "../page";

jest.mock("next-intl", () => {
  const translations = {
    title: "Group Booking",
    description: "Fill out the form below",
    titles: ["Title 1", "Title 2"],
    visitReasons: ["Reason 1", "Reason 2"],
    bookerOptions: ["Personal"],
    purposeOptions: ["Leisure"],
    packageOptions: ["Meal Deal"],
    roomTypes: [
      { id: "room-1", name: "Single Room" },
      { id: "room-2", name: "Double Room" },
    ],
    returnHome: "Cancel and return to home",
    returnHomeLink: "/",
  };

  const t = (key: keyof typeof translations) => translations[key] || key;
  (t as any).raw = (key: keyof typeof translations) => translations[key];

  return {
    useTranslations: jest.fn().mockImplementation(() => t),
  };
});

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const fixedProps = {
      ...props,
      priority: props.priority ? "true" : undefined,
    };
    return <img {...fixedProps} />;
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  notFound: () => null,
}));

jest.mock("react", () => {
  const actual = jest.requireActual("react") as typeof import("react");

  return {
    ...actual,
    use: ((promise: Promise<unknown>) => {
      const [value, setValue] = actual.useState<unknown>(undefined);

      actual.useEffect(() => {
        promise.then(setValue);
      }, [promise]);

      return value ?? {};
    }) as <T>(promise: Promise<T>) => T,
  };
});

jest.mock("@/context/ThemeContext", () => ({
  ...jest.requireActual("@/context/ThemeContext"),
  useTheme: () => ({
    theme: "light",
    toggleTheme: jest.fn(),
  }),
}));

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: "Test Hotel" }]),
    })
  ) as jest.Mock;
});

afterAll(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderBookingPage = async () => {
  const mockParams = Promise.resolve({ locale: "en-GB" });
  await act(async () => {
    render(
      <ThemeProvider>
        <BookingPage params={mockParams} />
      </ThemeProvider>
    );
  });
};

describe("Core Functionality", () => {
  it("renders without crashing", async () => {
    await renderBookingPage();
    expect(screen.getByText("Group Booking")).toBeInTheDocument();
  });

  it("displays the correct title and description", async () => {
    await renderBookingPage();
    expect(screen.getByText("Group Booking")).toBeInTheDocument();
    expect(screen.getByText("Fill out the form below")).toBeInTheDocument();
  });

  it("has correct link for returning home", async () => {
    await renderBookingPage();
    const homeLink = screen.getByRole("link", {
      name: /Cancel and return to home/i,
    });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});

describe("Theme Functionality", () => {
  let mockToggleTheme: jest.Mock;

  beforeEach(() => {
    mockToggleTheme = jest.fn();
    jest.mock("@/context/ThemeContext", () => ({
      useTheme: () => ({
        theme: "light",
        toggleTheme: mockToggleTheme,
      }),
    }));
  });

  it("renders with light theme by default", async () => {
    await renderBookingPage();

    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveClass("bg-gray-50");

    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(themeButton).toHaveClass("bg-gray-200");
  });

  it("toggles theme when button is clicked", async () => {
    await renderBookingPage();

    const themeButton = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(themeButton);

    const mainElement = screen.getByRole("main");
      expect(mainElement).toHaveClass("bg-gray-50");
      expect(themeButton).toHaveClass("bg-gray-200");
  });

  it("shows sun icon in light mode and moon icon in dark mode", async () => {
    await renderBookingPage();

    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
  });

  it("should show moon icon in dark mode", async () => {
    jest
      .spyOn(require("@/context/ThemeContext"), "useTheme")
      .mockImplementation(() => ({
        theme: "dark",
        toggleTheme: mockToggleTheme,
      }));

    await renderBookingPage();
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
  });

  it("applies correct text colors based on theme", async () => {
    jest
      .spyOn(require("@/context/ThemeContext"), "useTheme")
      .mockImplementation(() => ({
        theme: "dark",
        toggleTheme: mockToggleTheme,
      }));

    await renderBookingPage();

    const title = screen.getByText("Group Booking");
    expect(title).toHaveClass("text-gray-100");

    expect(title).toHaveClass("text-gray-100");
  });
});
