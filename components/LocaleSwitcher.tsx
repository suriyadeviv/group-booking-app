"use client";

import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";
import { useState } from "react";
import { countryCode } from "@/config/i18n";

export default function LocaleSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //switch to the selected locale
  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = routing.locales.reduce(
      (path, locale) => path.replace(`/${locale}`, ""),
      pathname
    );
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {/* Show the selected locale */}
        {countryCode.find((option) => option.value === currentLocale)?.label ||
          "Select Locale"}
      </button>
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1 rounded-md bg-white shadow-xs">
            {countryCode.map((option) => (
              <button
                key={option.value}
                onClick={() => switchLocale(option.value)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
