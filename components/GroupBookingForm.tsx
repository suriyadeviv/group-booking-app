"use client";

import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "@/lib";
import AccordionSection from "./AccordionSection";
import ContactDetailsSection from "./ContactDetailsSection";
import RoomRequirementsSection from "./RoomRequirementsSection";
import BookingDetailsSection from "./BookingDetailsSection";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/stories/button/Button";
import { OverlayModal } from "@/stories/modal/OverlayModal";

export default function GroupBookingForm() {
  const t = useTranslations("GroupBooking");
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "contact"
  );
  const { theme } = useTheme();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      bookerType: "",
      stayPurpose: "",
      hotel: "",
      checkIn: "",
      checkOut: ""
    },
  });

  useEffect(() => {
    const firstErrorKey = Object.keys(methods.formState.errors)[0];
    if (firstErrorKey) {
      const el = document.getElementById(firstErrorKey);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        (el as HTMLElement).focus?.();
      }
    }
  }, [methods.formState.errors]);

  const {
    handleSubmit
  } = methods;

  const handleToggle = async (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const onSubmit = async (data: FormData) => {

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await response.json();
        setShowSuccessModal(true);
        methods.reset();
      } else {
        console.error("Submission failed:", response.status);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return showSuccessModal ? (
    <OverlayModal
      isOpen={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      theme={theme}
    />
  ) : (
    <FormProvider {...methods}>
      <form role='form'
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-4xl mx-auto"
      >
        <div className="space-y-4">
          <AccordionSection
            id="contact"
            title={t("contactTitle")}
            isFirst={true}
            isActive={activeAccordion === "contact"}
            onToggle={() => handleToggle("contact")}
            theme={theme}
          >
            <ContactDetailsSection
              onNext={() => setActiveAccordion("booking")}
            />
          </AccordionSection>

          <AccordionSection
            id="booking"
            title={t("bookingDetails")}
            isActive={activeAccordion === "booking"}
            onToggle={() => handleToggle("booking")}
            theme={theme}
          >
            <BookingDetailsSection onNext={() => setActiveAccordion("rooms")} />
          </AccordionSection>

          <AccordionSection
            id="rooms"
            title={t("roomRequirements")}
            isLast={true}
            isActive={activeAccordion === "rooms"}
            onToggle={() => handleToggle("rooms")}
            theme={theme}
          >
            <RoomRequirementsSection />
          </AccordionSection>
        </div>

        <div className="mt-6">
          <Button
            label={t("submitBooking")}
            name="submitBooking"
            primary
            size="large"
            backgroundColor={theme === "dark" ? "#0d9488" : "#0f766e"}
            theme={theme}
            type="submit"
          />
        </div>
      </form>
    </FormProvider>
  );
}
