"use client";

import { useTranslations } from "next-intl";
import { useFormContext, Controller } from "react-hook-form";
import { useTheme } from "@/context/ThemeContext";
import { Room } from "@/types/room";
import { Input } from "@/stories/input/Input";
import Alert from "@/stories/alerts/Alert";

export default function RoomRequirementsSection() {
  const t = useTranslations("GroupBooking");
  const { theme } = useTheme();
  const {
    control,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const familyRoomIncl = watch("familyRoom", false);
  const accessibleRoomIncl = watch("accessibleRoom", false);

  const roomCounts = watch("roomCount") || {};
  // room counting
 const totalRooms = Object.entries(roomCounts).reduce((sum, [_key, count]) => {
    const isVisible = true;
    return isVisible ? sum + parseInt(count as string, 10) : sum;
  }, 0);

  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-700";
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const btnBg =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-gray-50 hover:bg-gray-100 text-gray-600";

  return (
    <div>
      <div className="mb-6">
        <p className={`text-sm font-medium mb-3 ${textColor}`}>
          {t("roomSelect")}
        </p>
        <p className={`text-sm font-medium mb-3 ${textColor}`}>
          <a
            href={
              t("roomTypesLink") ||
              "https://www.premierinn.com/gb/en/sleep/our-rooms.html"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 ml-2"
          >
            {t("roomTypesLinkDesc") || "See room types"}
          </a>
        </p>

        <div className="flex items-center mb-4">
          <Controller
            name="familyRoom"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Input
                {...field}
                label={t("familyRoom")}
                required
                checked={field.value}
                type="checkbox"
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${borderColor}`}
                theme={theme}
              />
            )}
          />
        </div>

        <div className="flex items-center mb-6">
          <Controller
            name="accessibleRoom"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Input
                {...field}
                label={t("accessibleRoom")}
                required
                checked={field.value}
                type="checkbox"
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${borderColor}`}
                theme={theme}
              />
            )}
          />
        </div>

        {familyRoomIncl && (
          <div className="my-4">
            <Alert
              type="warning"
              theme={theme}
              message={
                <span className={`text-sm`}>
                  {t("roomRules")}{" "}
                  <a
                    href={t("readOccupancyLink")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 ml-2"
                  >
                    {t("readOccupancy")}
                  </a>
                </span>
              }
            />
          </div>
        )}

        {(errors.roomCount || totalRooms < 10) && (
          <div className="my-4">
            <Alert
              type="warning"
              theme={theme}
              message={
                <span className={`text-sm p-2`}>
                  {t("groupBookingRestrictions")}
                  <a
                    href={t("websiteLinkText") || "https://www.premierinn.com/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 ml-2"
                  >
                    {t("websiteLinkText") || "visit our website"}
                  </a>

                  {errors.roomCount && (
                    <p className="text-red-500 mt-2">
                      {errors.roomCount.message as string}
                    </p>
                  )}
                </span>
              }
            />
          </div>
        )}

        <div className="space-y-4">
          {t.raw("roomTypes").map((room: Room) => (
            <div
              key={room.id}
              className={`flex justify-between items-center border p-4 ${borderColor}`}
            >
              <div>
                <p className={`text-sm font-medium ${textColor}`}>
                  {room.name}
                </p>
                <p className="text-xs text-gray-500">{room.description}</p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    const currentCount = roomCounts[room.id] || 0;
                    const newCount = Math.max(0, currentCount - 1);
                    setValue(`roomCount.${room.id}`, newCount, {
                      shouldDirty: true,
                    });
                  }}
                  className={`w-8 h-8 flex items-center justify-center border ${borderColor} rounded-l-md ${btnBg}`}
                >
                  -
                </button>
                <span
                  className={`w-10 h-8 flex items-center justify-center border-t border-b ${borderColor} ${bgColor} text-sm ${textColor}`}
                >
                  {roomCounts[room.id] || 0}
                </span>
                <button
                  type="button"
                  data-testid={`room-${room.id}-count`}
                  onClick={() => {
                    const currentCount = roomCounts[room.id] || 0;
                    const newCount = currentCount + 1;
                    setValue(`roomCount.${room.id}`, newCount, {
                      shouldDirty: true,
                    });
                  }}
                  className={`w-8 h-8 flex items-center justify-center border ${borderColor} rounded-r-md ${btnBg}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {familyRoomIncl &&
            t.raw("familyRoomTypes").map((room: Room) => (
              <div
                key={room.id}
                className={`flex justify-between items-center border p-4 ${borderColor}`}
              >
                <div>
                  <p className={`text-sm font-medium ${textColor}`}>
                    {room.name}
                  </p>
                  <p className="text-xs text-gray-500">{room.description}</p>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const currentCount = roomCounts[room.id] || 0;
                      const newCount = Math.max(0, currentCount - 1);
                      setValue(`roomCount.${room.id}`, newCount, {
                        shouldDirty: true,
                      });
                    }}
                    className={`w-8 h-8 flex items-center justify-center border ${borderColor} rounded-l-md ${btnBg}`}
                  >
                    -
                  </button>
                  <span
                    className={`w-10 h-8 flex items-center justify-center border-t border-b ${borderColor} ${bgColor} text-sm ${textColor}`}
                  >
                    {roomCounts[room.id] || 0}
                  </span>
                  <button
                    type="button"
                    data-testid={`room-${room.id}-count`}
                    onClick={() => {
                      const currentCount = roomCounts[room.id] || 0;
                      const newCount = currentCount + 1;
                      setValue(`roomCount.${room.id}`, newCount, {
                        shouldDirty: true,
                      });
                    }}
                    className={`w-8 h-8 flex items-center justify-center border ${borderColor} rounded-r-md ${btnBg}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

          {accessibleRoomIncl &&
            t.raw("accessibleRoomTypes").map((room: Room) => (
              <div
                key={room.id}
                className={`flex justify-between items-center border p-4 ${borderColor}`}
              >
                <div>
                  <p className={`text-sm font-medium ${textColor}`}>
                    {room.name}
                  </p>
                  <p className="text-xs text-gray-500">{room.description}</p>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const currentCount = roomCounts[room.id] || 0;
                      const newCount = Math.max(0, currentCount - 1);
                      setValue(`roomCount.${room.id}`, newCount, {
                        shouldDirty: true,
                      });
                    }}
                    className={`w-8 h-8 flex items-center justify-center border ${borderColor} rounded-l-md ${btnBg}`}
                  >
                    -
                  </button>
                  <span
                    className={`w-10 h-8 flex items-center justify-center border-t border-b ${borderColor} ${bgColor} text-sm ${textColor}`}
                  >
                    {roomCounts[room.id] || 0}
                  </span>
                  <button
                    type="button"
                    data-testid={`room-${room.id}-count`}
                    onClick={() => {
                      const currentCount = roomCounts[room.id] || 0;
                      const newCount = currentCount + 1;
                      setValue(`roomCount.${room.id}`, newCount, {
                        shouldDirty: true,
                      });
                    }}
                    className={`w-8 h-8 flex items-center justify-center border ${borderColor} rounded-r-md ${btnBg}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

          <div className="flex justify-between items-center pt-4 border-t">
            <p className={`text-sm font-medium ${textColor}`}>
              {t("totalRooms")}
            </p>
            <p className={`text-sm font-medium ${textColor}`}>
              {totalRooms as number} {t("rooms")}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className={`block text-sm font-medium mb-1 ${textColor}`}>
          {t("additionalNotes")}
        </label>
        <p className={`text-sm font-medium mb-3 ${textColor}`}>
          {t("additionalNotesWords")}
        </p>
        <textarea
          className={`block w-full rounded-md ${borderColor} shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border ${bgColor} ${textColor}`}
          rows={2}
        />
      </div>
    </div>
  );
}
