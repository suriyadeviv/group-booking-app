import { render, screen, fireEvent } from "@testing-library/react";
import RoomRequirementsSection from "../RoomRequirementsSection";

jest.mock("next-intl", () => {
  const translations = {
    roomSelect: "Select your rooms",
    roomTypesLink: "https://example.com/rooms",
    roomTypesLinkDesc: "View room types",
    familyRoom: "Family Room rules",
    accessibleRoom: "Accessible Room",
    roomRules: "Room rules apply",
    readOccupancy: "Read about occupancy",
    groupBookingRestrictions: "Group booking restrictions apply",
    websiteLinkText: "Visit our website",
    totalRooms: "Total Rooms",
    rooms: "rooms",
    additionalNotes: "Additional Notes",
    additionalNotesWords: "Please add any special requests",
    roomTypes: [
      { id: "standard", name: "Standard Room", description: "1 double bed" },
      { id: "twin", name: "Twin Room", description: "2 single beds" },
    ],
    familyRoomTypes: [
      { id: "family", name: "Family Room", description: "2 double beds" },
    ],
    accessibleRoomTypes: [
      {
        id: "accessible",
        name: "Accessible Room",
        description: "Wheelchair accessible",
      },
    ],
  };

  const t: {
    (key: keyof typeof translations):
      | string
      | (typeof translations)[keyof typeof translations];
    raw: (
      key: keyof typeof translations
    ) => string | (typeof translations)[keyof typeof translations];
  } = (key: keyof typeof translations) => translations[key] || key;

  t.raw = (key) => translations[key];

  return {
    useTranslations: jest.fn().mockImplementation(() => t),
  };
});

const mockFormContext = {
  register: jest.fn(),
  control: {},
  setValue: jest.fn(),
  watch: jest.fn((field) => {
    const values: Record<string, any> = {
      familyRoom: false,
      accessibleRoom: false,
      roomCount: {},
      additionalNotes: "",
    };
    return values[field];
  }),
  formState: { errors: {} },
};

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light" }),
}));

jest.mock("react-hook-form", () => ({
  useFormContext: () => mockFormContext,
  Controller: ({ render }: any) => render({ field: {} }),
}));

describe("RoomRequirementsSection", () => {
  it("renders room types correctly", () => {
    render(<RoomRequirementsSection />);

    expect(screen.getByText("Standard Room")).toBeInTheDocument();
    expect(screen.getByText("Twin Room")).toBeInTheDocument();
    expect(screen.queryByText("Family Room")).not.toBeInTheDocument();
  });

  it("toggles family room types when checkbox clicked", () => {
    const mockWatch = jest.fn((field) => {
      const values: Record<string, any> = {
        familyRoom: false,
        accessibleRoom: false,
        roomCount: {},
        additionalNotes: "",
      };

      if (field === "familyRoom") return true;
      return values[field];
    });

    jest.spyOn(mockFormContext, "watch").mockImplementation(mockWatch);

    render(<RoomRequirementsSection />);

    expect(screen.getByText("Family Room")).toBeInTheDocument();
    expect(screen.getByText("Room rules apply")).toBeInTheDocument();
  });

  it("updates room count when buttons clicked", () => {
    const mockSetValue = jest.fn();
    jest.spyOn(mockFormContext, "setValue").mockImplementation(mockSetValue);

    render(<RoomRequirementsSection />);

    fireEvent.click(screen.getAllByText("+")[0]);
    expect(mockSetValue).toHaveBeenCalledWith("roomCount.standard", 1, {
      shouldDirty: true,
    });

    fireEvent.click(screen.getAllByText("-")[0]);
    expect(mockSetValue).toHaveBeenCalledWith("roomCount.standard", 0, {
      shouldDirty: true,
    });
  });
});
