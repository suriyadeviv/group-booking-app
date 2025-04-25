import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import BookingDetailsSection from "../BookingDetailsSection";
import { useFormContext, useWatch } from "react-hook-form";

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(),
  useWatch: jest.fn(),
  Controller: ({ render }: any) => render({ field: {} }),
}));

jest.mock("next-intl", () => {
  const translations = {
    visitReasons: ["Reason 1", "Reason 2"],
    bookerType: "What type of booker are you?",
    stayPurpose: "What is the purpose of your stay?",
    bookingDetails: "Booking Details",
    checkInOut: "Check In / Check Out",
    continue: "Continue",
    bookerOptions: ["Personal"],
    purposeOptions: ["Leisure"],
    packageOptions: ["Meal Deal"],
    select: "Select a hotel",
    errors: {
      hotel: "Please select a hotel",
    },
  };

  const t: {
    (key: keyof typeof translations):
      | string
      | (typeof translations)[keyof typeof translations];
    raw: (
      key: keyof typeof translations
    ) => string | (typeof translations)[keyof typeof translations];
  } = (key: keyof typeof translations) => translations[key] || key;

  t.raw = (key) => translations[key];
  return {
    useTranslations: jest.fn().mockImplementation(() => t),
  };
});

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light" }),
}));

describe("BookingDetailsSection", () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: "Test Hotel" }]),
      })
    ) as jest.Mock;

    (useFormContext as jest.Mock).mockReturnValue({
      register: jest.fn(),
      control: {},
      formState: { errors: { hotel: { message: "Please select a hotel" } } },
      clearErrors: jest.fn(),
      trigger: jest.fn().mockResolvedValue(true),
      getValues: jest.fn().mockImplementation((field) => {
        if (field === "checkIn") return "2025-05-01";
        if (field === "checkOut") return "2025-05-05";
        return {
          bookerType: "personal",
          stayPurpose: "business",
          hotel: "",
        };
      }),
    });

    (useWatch as jest.Mock).mockReturnValue("personal");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderBookingSection = async() => {
    await act(async () => {
      render(<BookingDetailsSection onNext={mockOnNext} />);
    });
  };

  it("renders the booking form with all sections", async () => {
    await renderBookingSection();

    expect(
      screen.getByText("What type of booker are you? *")
    ).toBeInTheDocument();
    expect(
      screen.getByText("What is the purpose of your stay? *")
    ).toBeInTheDocument();
    expect(screen.getByText("Booking Details")).toBeInTheDocument();
    expect(screen.getByText("Check In / Check Out")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("calls onNext when continue button is clicked and form is valid", async () => {
    await renderBookingSection();

    expect(mockOnNext).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => expect(mockOnNext).toHaveBeenCalledTimes(1));
  });
});
