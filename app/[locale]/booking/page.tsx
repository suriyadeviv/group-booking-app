"use client";
import GroupBookingForm from "@/components/GroupBookingForm";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Locale, routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense, use } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

export default function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = useTranslations("GroupBooking");
  const { locale } = use(params);
  const { theme, toggleTheme } = useTheme();

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header Section */}
      <header
        className={`shadow-sm transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center">
                <div className="bg-white/90 p-1 rounded-md">
                  <Image
                    src="/pi-logo-rest-easy.svg"
                    alt="Company Logo"
                    width={100}
                    height={100}
                    className="h-10 w-auto"
                  />
                </div>
                <h1
                  className={`ml-2 p-6 text-l font-semibold ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {t("title")}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LocaleSwitcher currentLocale={locale} />

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  theme === "dark"
                    ? "bg-gray-700 text-yellow-300"
                    : "bg-gray-200 text-gray-700"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <FaSun
                    data-testid="sun-icon"
                    className="text-yellow-500"
                    size={20}
                  />
                ) : (
                  <FaMoon
                    data-testid="moon-icon"
                    className="text-gray-100"
                    size={20}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`flex-1 min-h-[calc(100vh-72px)] transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center py-8">
          <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("description")}
              </p>
            </div>

            <div
              className={`shadow-sm rounded-lg p-6 transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-900"
              }`}
            >
                {/* Lazy load the GroupBookingForm component */}
              <Suspense
                fallback={
                  <div
                    className={`h-[600px] w-full animate-pulse ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  ></div>
                }
              >
                <GroupBookingForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer
        className={`py-4 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } flex items-center space-x-2`}
          >
            <span className="text-xl">
              <svg
                className="w-5 h-5 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
            <Link href={t("returnHomeLink")} passHref>
              {t("returnHome")}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
