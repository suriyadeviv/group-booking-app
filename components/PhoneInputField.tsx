"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export function PhoneInputField({
  name,
  theme,
}: {
  name: string;
  theme: string;
}) {
  const t = useTranslations("GroupBooking");
  const inputId = useId();

  const {
    register,
    formState: { errors, isDirty },
    clearErrors,
    setValue,
    watch,
  } = useFormContext();

  const phoneValue = watch(name);

  const validatePhoneNumber = (value: string) => {
    if (!value) return true;

    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Default case: expect exactly 10 digits
    return digitsOnly.length === 10 || (t("errors.phoneInvalid") as string);
  };

  const inputClass =
    theme === "dark"
      ? "block w-full rounded-md py-2 px-3 border border-gray-600 bg-gray-800 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
      : "block w-full rounded-md py-2 px-3 border border-gray-300 bg-white text-black shadow-sm focus:border-blue-500 focus:ring-blue-500";

  const countrySelectorClass =
    theme === "dark"
      ? "h-full px-3 border-r border-gray-600 rounded-l-md bg-gray-700 text-white"
      : "h-full px-3 border-r border-gray-300 rounded-l-md bg-gray-50 text-black";

  const dropdownClass =
    theme === "dark"
      ? "mt-1 w-full rounded-md bg-gray-800 shadow-lg border border-gray-600 z-10"
      : "mt-1 w-full rounded-md bg-white shadow-lg border border-gray-300 z-10";

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {t("fields.phone")} *
      </label>
      <PhoneInput
        inputProps={{
          id: inputId,
          "aria-label": t("fields.phone"),
          "aria-invalid": errors[name] ? "true" : "false",
        }}
        defaultCountry="gb"
        value={phoneValue}
        {...register(name, {
          required: t("errors.phoneRequired") || "Phone number is required",
          validate: {
            validPhoneNumber: validatePhoneNumber,
          },
        })}
        onChange={(phone) => {
          setValue(name, phone, { shouldValidate: isDirty });
          if (errors[name]) clearErrors(name);
        }}
        inputClassName={inputClass}
        countrySelectorStyleProps={{
          buttonClassName: countrySelectorClass,
          dropdownStyleProps: {
            className: dropdownClass,
          },
        }}
      />
      {errors[name] && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
