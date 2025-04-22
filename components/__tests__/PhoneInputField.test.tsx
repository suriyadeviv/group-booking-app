import { render, screen, fireEvent } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { PhoneInputField } from "../PhoneInputField";
import "react-international-phone/style.css";

jest.mock("next-intl", () => {
  const translations = {
    fields: {
      phone: "Phone Number",
    },
    errors: {
      phoneRequired: "Phone number is required",
      phoneInvalid: "Phone number must be 10 digits",
    },
  };

  const t: {
    (key: keyof typeof translations): string | typeof translations[keyof typeof translations];
    raw: (key: keyof typeof translations) => string | typeof translations[keyof typeof translations];
  } = (key: keyof typeof translations) => translations[key] || key;

  t.raw = (key) => translations[key];

  return {
    useTranslations: jest.fn().mockImplementation(() => t),
  };
});

// Mock react-international-phone to simplify testing
jest.mock("react-international-phone", () => ({
  PhoneInput: jest.fn(({ value, onChange, inputProps, inputClassName }) => (
    <div>
      <input
        {...inputProps}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClassName}
        data-testid="phone-input"
      />
    </div>
  )),
}));

describe("PhoneInputField", () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm({
      defaultValues: { phoneNumber: "" },
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it("renders correctly with light theme", async () => {
    await render(
      <Wrapper>
        <PhoneInputField name="phoneNumber" theme="light" />
      </Wrapper>
    );

    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
    expect(screen.getByTestId("phone-input")).toHaveClass(
      "bg-white text-black"
    );
  });

  it("renders correctly with dark theme", () => {
    render(
      <Wrapper>
        <PhoneInputField name="phoneNumber" theme="dark" />
      </Wrapper>
    );

    expect(screen.getByTestId("phone-input")).toHaveClass(
      "bg-gray-800 text-white"
    );
  });

  it("accepts valid phone number", async () => {
    render(
      <Wrapper>
        <PhoneInputField name="phoneNumber" theme="light" />
      </Wrapper>
    );

    const input = screen.getByTestId("phone-input");
    fireEvent.change(input, { target: { value: "1234567890" } });
    fireEvent.blur(input);

    expect(
        await screen.queryByText("Phone number is required")
    ).not.toBeInTheDocument();
    expect(
        await screen.queryByText("Phone number must be 10 digits")
    ).not.toBeInTheDocument();
  });

  it("handles non-digit characters in validation", async () => {
     render(
      <Wrapper>
        <PhoneInputField name="phoneNumber" theme="light" />
      </Wrapper>
    );

    const input = screen.getByTestId("phone-input");
    fireEvent.change(input, { target: { value: "(123) 456-7890" } });
    fireEvent.blur(input);

    expect(
        await screen.queryByText("Phone number must be 10 digits")
    ).not.toBeInTheDocument();
  });

});
