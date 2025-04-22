"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { PhoneInputField } from "./PhoneInputField";
import { Button } from "@/stories/button/Button";
import { Input } from "@/stories/input/Input";
import Select from "@/stories/select/Select";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface ContactDetailsSectionProps {
  onNext: () => void;
}

export default function ContactDetailsSection({
  onNext,
}: ContactDetailsSectionProps) {
  const t = useTranslations("GroupBooking");
  const { theme } = useTheme();
  const {
    register,
    formState: { errors },
    clearErrors,
    trigger,
  } = useFormContext();

  const handleContinue = async () => {
    const isValid = await trigger([
      "title",
      "firstName",
      "lastName",
      "phone",
      "email",
    ]);
    if (isValid) {
      onNext();
    }
  };

  const titles = t.raw("titles");
  const titleOptions = Object.entries(titles).map(([value, label]) => ({
    value,
    label: label as string,
  }));

  const [title, setTitle] = useState("");

  return (
    <div className={`space-y-4 p-4 transition-colors duration-300 ${
      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    }`}>
      {/* Title Field */}
      <div>
        <Select
          selectId={t("fields.title")}
          label={t("fields.title")}
          required
          {...register("title", {
            required: t("errors.titleRequired") || "Title is required",
          })}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            clearErrors("title");
          }}
          error={errors.title?.message as string}
          options={titleOptions}
          theme={theme}
        />
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label={t("fields.firstName")}
            required
            type="text"
            placeholder={t("fields.firstName")}
            data-testid="firstName-input" 
            {...register("firstName", {
              required:
                t("errors.firstNameRequired") || "First name is required",
            })}
            onChange={() => clearErrors("firstName")}
            error={errors.firstName?.message as string}
            theme={theme}
          />
        </div>
        <div>
          <Input
            label={t("fields.lastName")}
            required
            type="text"
            placeholder={t("fields.lastName")}
            data-testid="lastName-input" 
            {...register("lastName", {
              required: t("errors.lastNameRequired") || "Last name is required",
            })}
            onBlur={() => trigger("lastName")}
            error={errors.lastName?.message as string}
            theme={theme} 
          />
        </div>
      </div>

      {/* Phone Field */}
      <div>
        <PhoneInputField 
          name="phone" 
          theme={theme}
        />
      </div>

      {/* Email Field */}
      <div>
        <Input
          label={t("fields.email")}
          required
          type="email"
          placeholder={t("fields.email")}
          data-testid="email-input" 
          {...register("email", {
            required: t("errors.emailRequired") || "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t("errors.emailInvalid") || "Invalid email address",
            },
          })}
          onBlur={() => trigger("email")}
          error={errors.email?.message as string}
          theme={theme} 
        />
      </div>

      {/* Continue Button */}
      <div className="mt-4">
        <Button
          label={t("continue")}
          primary
          size="large"
          backgroundColor={theme === 'dark' ? '#0d9488' : '#0f766e'}
          theme={theme}
          onClick={handleContinue}
        />
      </div>
    </div>
  );
}