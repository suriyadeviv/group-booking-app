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
  const [submitAttempted, setSubmitAttempted] = useState(false);

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
  
  const handleToggle = async (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  
  const wrappedSubmit = handleSubmit(async (data: FormData) => {
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
  });

  useEffect(() => {
    if (!submitAttempted) return;
  
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      const fieldToAccordionMap: Record<string, string> = {
        title: "contact",
        firstName: "contact",
        lastName: "contact",
        phone: "contact",
        email: "contact",
        bookerType: "booking",
        stayPurpose: "booking",
        hotel: "booking",
        checkIn: "booking",
        checkOut: "booking",
        roomCount: "rooms",
      };
  
      const accordionId = fieldToAccordionMap[firstErrorKey];
      if (accordionId) {
        setActiveAccordion(accordionId);
      }
      // Scroll to the first error field
      setTimeout(() => {
        const el = document.getElementById(firstErrorKey);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          (el as HTMLElement).focus?.();
        }
      }, 300);
    }
  }, [errors, submitAttempted]);
  
  
  return showSuccessModal ? (
    <OverlayModal
      isOpen={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      theme={theme}
    />
  ) : (
    <FormProvider {...methods}>
      <form role='form'
        onSubmit={(e) => {
          setSubmitAttempted(true);
          wrappedSubmit(e);
        }}
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
