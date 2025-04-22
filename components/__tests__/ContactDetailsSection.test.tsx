import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useFormContext } from "react-hook-form";
import ContactDetailsSection from "../ContactDetailsSection";

jest.mock("next-intl", () => {
  const translations = {
    title: "Group Booking",
    description: "Fill out the form below",
    titles: ["Title 1", "Title 2"],
    continue: "Continue",
    fields: {
      title: "Title",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone number",
      email: "Email",
    },
    errors: {
      titleRequired: "Title is required",
      firstNameRequired: "First name is required",
      lastNameRequired: "Last name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email address",
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

jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => ({
    register: jest.fn(),
    formState: { errors: {} },
    clearErrors: jest.fn(),
    trigger: jest.fn().mockResolvedValue(true),
    watch: jest.fn(),
    setValue: jest.fn(),
  })),
}));

describe("ContactDetailsSection", () => {
  const mockOnNext = jest.fn();
  beforeEach(() => {
    mockOnNext.mockClear();
  });

  const renderContactSection = () => {
    render(<ContactDetailsSection onNext={mockOnNext} />);
  };

  it("renders title field", async () => {
    await renderContactSection();
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("renders first name and last name fields", async () => {
    await renderContactSection();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
  });

  it("renders email field", async () => {
    await renderContactSection();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders phone field", async () => {
    await renderContactSection();
    expect(screen.getByText("Phone number *")).toBeInTheDocument();
  });

  it("click continue button", async () => {
    await renderContactSection();
    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => expect(mockOnNext).toHaveBeenCalled());
  });

  it("should trigger validation and call onNext if valid", async () => {
    const triggerMock = jest.fn().mockResolvedValue(true);
    (useFormContext as jest.Mock).mockReturnValue({
      register: jest.fn(),
      formState: { errors: {} },
      clearErrors: jest.fn(),
      trigger: triggerMock,
      watch: jest.fn(),
      setValue: jest.fn(),
    });

    renderContactSection();
    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(triggerMock).toHaveBeenCalled();
      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  it("should not call onNext if validation fails", async () => {
    const triggerMock = jest.fn().mockResolvedValue(false);
    (useFormContext as jest.Mock).mockReturnValue({
      register: jest.fn(),
      formState: { errors: {} },
      clearErrors: jest.fn(),
      trigger: triggerMock,
      watch: jest.fn(),
      setValue: jest.fn(),
    });

    renderContactSection();
    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(triggerMock).toHaveBeenCalled();
      expect(mockOnNext).not.toHaveBeenCalled();
    });
  });

  it("should not call onNext if validation fails", async () => {
    const mockTrigger = jest.fn().mockResolvedValueOnce(false);

    (useFormContext as jest.Mock).mockReturnValue({
      register: jest.fn(),
      formState: { errors: {} },
      clearErrors: jest.fn(),
      trigger: mockTrigger,
      watch: jest.fn(),
      setValue: jest.fn(),
    });

    render(<ContactDetailsSection onNext={mockOnNext} />);
    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => expect(mockOnNext).not.toHaveBeenCalled());
  });
});
