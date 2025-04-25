import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroupBookingForm from "../GroupBookingForm";

// Mock translations and theme
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light" }),
}));

jest.mock("../ContactDetailsSection", () => {
  const MockComponent = () => <div data-testid="ContactDetails" />;
  MockComponent.displayName = "MockContactDetailsSection";
  return MockComponent;
});

jest.mock("../BookingDetailsSection", () => {
  const MockComponent = () => <div data-testid="BookingDetails" />;
  MockComponent.displayName = "MockBookingDetailsSection";
  return MockComponent;
});

jest.mock("../RoomRequirementsSection", () => {
  const MockComponent = () => <div data-testid="RoomRequirements" />;
  MockComponent.displayName = "MockRoomRequirementsSection";
  return MockComponent;
});

jest.mock("../AccordionSection", () => {
  const MockAccordion = ({ children, title }: any) => (
    <div data-testid={`Accordion-${title}`}>{children}</div>
  );
  MockAccordion.displayName = "MockAccordionSection";
  return MockAccordion;
});


jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useForm: () => ({
      handleSubmit: (fn: any) => () => fn({}), // mock submit with dummy data
      formState: { isValid: true, errors: {} },
      register: jest.fn(),
      watch: jest.fn(),
      control: {},
      reset: jest.fn(),
    }),
    FormProvider: ({ children }: any) => <div>{children}</div>,
  };
});


// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "success" }),
    })
  ) as jest.Mock;

  HTMLFormElement.prototype.requestSubmit = jest.fn();
});

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => () => ({}), 
}));


it("should submit form and show success modal", async () => {
  render(<GroupBookingForm />);

  const submitButton = screen.getByRole("button", { name: "submitBooking" });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith("/api/submit", expect.anything());
  });

  await waitFor(async () => {
    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();
  });
});
