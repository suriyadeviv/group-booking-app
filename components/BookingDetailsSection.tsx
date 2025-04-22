"use client";

import { Button } from "@/stories/button/Button";
import { Input } from "@/stories/input/Input";
import Select from "@/stories/select/Select";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

interface BookingDetailsSectionProps {
  onNext: () => void;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
}

export default function BookingDetailsSection({
  onNext,
}: BookingDetailsSectionProps) {
  const t = useTranslations("GroupBooking");
  const { theme } = useTheme();
  const {
    register,
    control,
    formState: { errors },
    clearErrors,
    trigger,
    getValues,
  } = useFormContext();

  const textColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const secondaryTextColor =
    theme === "dark" ? "text-gray-400" : "text-gray-500";
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const radioColor = theme === "dark" ? "text-blue-400" : "text-blue-600";
  const errorColor = theme === "dark" ? "text-red-400" : "text-red-600";
  const inputBgColor = theme === "dark" ? "bg-gray-700" : "bg-white";

  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetch("/api/hotels")
      .then((res) => res.json())
      .then((data) => setHotels(data))
      .catch((err) => console.error("Failed to fetch hotels", err));
  }, []);

  const handleContinue = async () => {
    const values = getValues();
    const fieldsToValidate = [
      "bookerType",
      "stayPurpose",
      "hotel",
      "checkIn",
      "checkOut",
      ...(values.bookerType !== "personal" ? ["companyName"] : []),
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) onNext();
  };

  const bookerType = useWatch({ control, name: "bookerType" });
  const showCompanyName = bookerType && bookerType !== "personal";
  const reasonOptions = Object.entries(t.raw("visitReasons")).map(
    ([value, label]) => ({
      value,
      label: label as string,
    })
  );

  return (
    <div className={`space-y-4 p-4 ${bgColor} rounded-lg`}>
      {/* Booker Type */}
      <div className="mb-6">
        <p className={`text-sm font-medium mb-3 ${textColor}`}>
          {t("bookerType")} *
        </p>
        <div className="space-y-2">
          {Object.entries(t.raw("bookerOptions")).map(([key, label]) => (
            <label
              key={key}
              className={`flex items-center space-x-3 w-full rounded-md p-3 border shadow-sm ${borderColor} ${bgColor}`}
            >
              <Input
                value={key}
                label={label as string}
                type="radio"
                data-testid="bookerType"
                {...register("bookerType", {
                  required: t("errors.bookerType"),
                })}
                className={`h-4 w-4 ${radioColor} focus:ring-blue-500 ${borderColor}`}
                theme={theme}
              />
            </label>
          ))}
        </div>
        {errors.bookerType && (
          <p className={`mt-1 text-sm ${errorColor}`}>
            {errors.bookerType.message as string}
          </p>
        )}
      </div>

      {showCompanyName && (
        <div className="mb-6 transition-all duration-200">
          <Input
            label={t("companyName")}
            type="text"
            placeholder="Company Name"
            data-testid="companyName"
            required
            {...register("companyName", {
              required: showCompanyName
                ? t("errors.companyNameRequired")
                : false,
            })}
            onChange={() => clearErrors("companyName")}
            theme={theme}
          />
          {errors.companyName && (
            <p className={`mt-1 text-sm ${errorColor}`}>
              {errors.companyName.message as string}
            </p>
          )}
        </div>
      )}

      {/* Stay Purpose */}
      <div className="mb-6">
        <p className={`text-sm font-medium mb-3 ${textColor}`}>
          {t("stayPurpose")} *
        </p>
        <div className="space-y-2">
          {Object.entries(t.raw("purposeOptions")).map(([key, label]) => (
            <label
              key={key}
              className={`flex items-center space-x-3 w-full rounded-md p-3 border shadow-sm ${borderColor} ${bgColor}`}
            >
              <Input
                value={key}
                label={label as string}
                type="radio"
                data-testid="stayPurpose"
                {...register("stayPurpose", {
                  required: t("errors.stayPurpose"),
                })}
                className={`h-4 w-4 ${radioColor} focus:ring-blue-500 ${borderColor}`}
                theme={theme}
              />
            </label>
          ))}
        </div>
        {errors.stayPurpose && (
          <p className={`mt-1 text-sm ${errorColor}`}>
            {errors.stayPurpose.message as string}
          </p>
        )}
      </div>

      {/* School Group Checkbox */}
      <div className="mb-6">
        <label
          className={`flex items-center space-x-3 w-full rounded-md p-3 border shadow-sm ${borderColor} ${bgColor}`}
        >
          <Input
            label={t("schoolGroup")}
            type="checkbox"
            data-testid="schoolGroup"
            {...register("isSchoolGroup")}
            className={`h-4 w-4 ${radioColor} focus:ring-blue-500 ${borderColor}`}
            theme={theme}
          />
        </label>
      </div>

      {/* Reason for visit */}
      <div className="mb-6">
        <Select
          id={t("reasonForVisit")}
          label={t("reasonForVisit")}
          defaultValue={t("select")}
          options={reasonOptions}
          theme={theme}
          className={`w-full p-2 rounded-md border shadow-sm ${borderColor} ${inputBgColor}`}
        />
      </div>

      {/* Hotel */}
      <div className="mb-6">
        <Select
           selectId="bookingDetails"
          label={t("bookingDetails")}
          options={hotels.map((hotel) => ({
            value: hotel.name,
            label: `${hotel.name} (${hotel.location})`,
          }))}
          {...register("hotel", { required: t("errors.hotel") })}
          onChange={() => clearErrors("hotel")}
          error={errors.hotle?.message as string}
          theme={theme}
          className={`w-full p-2 rounded-md border shadow-sm ${borderColor} ${inputBgColor}`}
        />
      </div>

      {/* Check-in / Check-out Dates */}
      <div className="mb-6">
        <p className={`text-sm font-medium mb-3 ${textColor}`}>
          {t("checkInOut")}
        </p>
        <div
          className={`flex space-x-4 w-full rounded-md p-3 border shadow-sm ${borderColor} ${bgColor}`}
        >
          <Controller
            name="checkIn"
            render={({ field }) => (
              <Input
              id="checkIn"
              data-testid="checkIn"
                type="date"
                required
                {...field}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  clearErrors("checkIn");
                }}
                theme={theme}
              />
            )}
            rules={{
              required: t("errors.checkIn"),
            }}
          />
          <span
            className={`flex p-2 space-x-4 font-semibold ${secondaryTextColor}`}
          >
            |
          </span>
          <Controller
            name="checkOut"
            render={({ field }) => {
              const checkIn = getValues("checkIn");
              const minDate = checkIn
                ? new Date(
                    new Date(checkIn).setDate(new Date(checkIn).getDate() + 1)
                  )
                    .toISOString()
                    .split("T")[0]
                : undefined;

              return (
                <Input
                id="checkOut"
                data-testid="checkOut"
                  type="date"
                  required
                  {...field}
                  min={minDate}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    clearErrors("checkOut");
                  }}
                  theme={theme}
                />
              );
            }}
            rules={{
              required: t("errors.checkOut"),
              validate: (value) => {
                const checkIn = getValues("checkIn");
                if (!checkIn) return true;
                return (
                  new Date(value) > new Date(checkIn) ||
                  t("errors.invalidCheckout")
                );
              },
            }}
          />
        </div>

        {errors.checkIn && (
          <p className={`mt-1 text-sm ${errorColor}`}>
            {errors.checkIn.message as string}
          </p>
        )}
        {errors.checkOut && (
          <p className={`mt-1 text-sm ${errorColor}`}>
            {errors.checkOut.message as string}
          </p>
        )}
      </div>

      {/* Package Type */}
      <div className="mb-6">
        <p className={`text-sm font-semibold mb-3 ${textColor}`}>
          {t("packageType")}
        </p>
        <p className={`text-sm font-medium mb-3 ${secondaryTextColor}`}>
          {t("packageInfo")}
        </p>
        <div className="space-y-2">
          {Object.entries(t.raw("packageOptions")).map(([key, label]) => (
            <label
              key={key}
              className={`flex items-center space-x-3 w-full rounded-md p-3 border shadow-sm ${borderColor} ${bgColor}`}
            >
              <Input
                value={key}
                label={label as string}
                data-testid="packageType"
                type="radio"
                className={`h-4 w-4 ${radioColor} focus:ring-blue-500 ${borderColor}`}
                theme={theme}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-4">
        <Button
          label={t("continue")}
          primary
          size="large"
          backgroundColor={theme === "dark" ? "#0d9488" : "#0f766e"}
          onClick={handleContinue}
        />
      </div>
    </div>
  );
}
