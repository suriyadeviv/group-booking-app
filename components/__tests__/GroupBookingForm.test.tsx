import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import GroupBookingForm from "../GroupBookingForm";
import userEvent from "@testing-library/user-event";

jest.mock("next-intl", () => {
  const translations = {
    title: "Group Booking",
    description: "Fill out the form below",
    contactTitle: "Contact details",
    titles: ["Title 1", "Title 2"],
    continue: "Continue",
    fields: {
      title: "Title",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone number",
      email: "Email",
    },
    visitReasons: ["Reason 1", "Reason 2"],
    bookerType: "What type of booker are you?",
    stayPurpose: "What is the purpose of your stay?",
    bookingDetails: "Booking Details",
    checkInOut: "Check In / Check Out",
    bookerOptions: ["Personal"],
    purposeOptions: ["Leisure"],
    packageOptions: ["Meal Deal"],
    select: "Select a hotel",
    submitBooking: "Submit request",
    roomTypes: [
      { id: "single", name: "Single Room" },
      { id: "double", name: "Double Room" },
    ],
    accessibleRoomTypes: [{ id: "a1", name: "ASingle Room" }],
    familyRoomTypes: [{ id: "f1", name: "FSingle Room" }],
    errors: {
      titleRequired: "Title is required",
      firstNameRequired: "First name is required",
      lastNameRequired: "Last name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email address",
      hotel: "Please select a hotel",
    },
  };

  const t = (key: string): string => {
    return key.split(".").reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : key;
    }, translations as any);
  };
  (t as any).raw = t;

  return {
    useTranslations: jest.fn(() => t),
  };
});

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light" }),
}));

describe("GroupBookingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn((url) => {
      if (url === "/api/hotels") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: 1, name: "Premier Inn London County Hall" },
            ]),
        });
      }

      if (url === "/api/submit") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: "Success" }),
        });
      }

      return Promise.reject(new Error("Unknown URL: " + url));
    }) as jest.Mock;
  });

  it("should have a submit button", async () => {
    await act(async () => {
      render(<GroupBookingForm />);
    });

    const submitButton = screen.getByRole("button", {
      name: /submit request/i,
    });
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("displays an error message when title is not filled", async () => {
    render(<GroupBookingForm />);

    const submitButton = screen.getByRole("button", {
      name: /submit request/i,
    });

    await userEvent.click(submitButton);

    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
  });

  it("fills out the form with all required details and submits successfully", async () => {

    await act(async () => {
      render(<GroupBookingForm />);
    });
    expect(screen.getByText("Contact details")).toBeInTheDocument();

    // Fill in all form fields as before
    fireEvent.change(screen.getByLabelText("Title *"), {
      target: { value: "Ms" },
    });
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Suriyadevi" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Varatharaju" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "suriyadevi.v@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+447405309740" },
    });

    fireEvent.change(screen.getByTestId("bookerType"), {
      target: { value: "personal" },
    });
    fireEvent.change(screen.getByTestId("stayPurpose"), {
      target: { value: "leisure" },
    });
    expect(global.fetch).toHaveBeenCalledWith("/api/hotels");
    fireEvent.change(screen.getByTestId("bookingDetails"), {
      target: { value: "Premier Inn London County Hall" },
    });

    const hotelSelect = screen.getByTestId("bookingDetails");
    expect(hotelSelect).toBeInTheDocument();
    await waitFor(() => {
      screen.getByText((content) =>
        content.includes("Premier Inn London County Hall")
      );
    });

    fireEvent.change(screen.getByTestId("checkIn"), {
      target: { value: "2025-04-20" },
    });
    fireEvent.change(screen.getByTestId("checkOut"), {
      target: { value: "2025-04-23" },
    });

    const submitButton = screen.getByRole("button", {
      name: /submit request/i,
    });

    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
