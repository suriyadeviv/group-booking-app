import { render, screen, fireEvent } from "@testing-library/react";
import LocaleSwitcher from "../LocaleSwitcher";
import { useRouter, usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@/types/i18n", () => ({
  countryCode: [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
  ],
}));

jest.mock("@/i18n/routing", () => ({
  routing: {
    locales: ["en", "es", "fr"],
  },
}));

describe("LocaleSwitcher", () => {
  const mockPush = jest.fn();
  const mockPathname = "/en/booking";

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with current locale", () => {
    render(<LocaleSwitcher currentLocale="en" />);
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("shows dropdown when clicked", () => {
    render(<LocaleSwitcher currentLocale="en" />);

    expect(screen.queryByText("Spanish")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("English"));

    expect(screen.getByText("Spanish")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("changes locale when option is selected", () => {
    render(<LocaleSwitcher currentLocale="en" />);

    fireEvent.click(screen.getByText("English"));

    fireEvent.click(screen.getByText("Spanish"));

    expect(mockPush).toHaveBeenCalledWith("/es/booking");
  });

  it("closes dropdown after selection", () => {
    render(<LocaleSwitcher currentLocale="en" />);

    fireEvent.click(screen.getByText("English"));

    fireEvent.click(screen.getByText("French"));

    expect(screen.queryByText("Spanish")).not.toBeInTheDocument();
  });

  it('shows "Select Locale" when current locale is invalid', () => {
    render(<LocaleSwitcher currentLocale="invalid" />);
    expect(screen.getByText("Select Locale")).toBeInTheDocument();
  });
});
