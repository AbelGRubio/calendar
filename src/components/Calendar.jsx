import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import BookingForm from "./BookingForm";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const today = dayjs().startOf("day");
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  // Generate days of the current month
  const daysInMonth = [];
  for (
    let d = startOfMonth;
    d.isBefore(endOfMonth) || d.isSame(endOfMonth);
    d = d.add(1, "day")
  ) {
    daysInMonth.push(d);
  }

  // Weekdays
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Generate slots in Madrid timezone
  const generateSlots = (startHour, endHour) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(
        dayjs().tz("Europe/Madrid").hour(hour).minute(0).format("HH:mm")
      );
      slots.push(
        dayjs().tz("Europe/Madrid").hour(hour).minute(30).format("HH:mm")
      );
    }
    return slots;
  };

  const slots = [
    ...generateSlots(11, 14), // Morning
    ...generateSlots(15, 18), // Afternoon
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 boder rounded-lg p-4 shadow-xl">
      {/* Left: Summary */}
        <div className="">
        <h2 className="text-xl font-bold mb-2">30 Minute Meeting</h2>
        <p className="text-gray-500 mb-4">
            Web conferencing details provided upon confirmation.
        </p>
        <div className="space-y-2 text-sm">
            <p>
            <strong>Date:</strong>{" "}
            {selectedDay
                ? dayjs(selectedDay).format("dddd, MMMM D, YYYY")
                : "Not selected"}
            </p>
            <p>
            <strong>Time:</strong> {selectedSlot || "Not selected"}
            </p>
            <p>
            <strong>Timezone:</strong> Europe/Madrid
            </p>
        </div>

        {/* Aviso extra */}
        <p className="text-xs text-gray-500 mt-4 italic">
            * The selected time may be subject to change.
        </p>
        </div>

      {/* Right: Calendar + Slots/Form */}
      <div className="col-span-2">
        {/* Calendar header */}
        {!selectedSlot && (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                className="px-2 py-1 rounded hover:bg-gray-200"
              >
                ←
              </button>
              <h2 className="text-lg font-semibold">
                {currentMonth.format("MMMM YYYY")}
              </h2>
              <button
                onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                className="px-2 py-1 rounded hover:bg-gray-200"
              >
                →
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {weekdays.map((w) => (
                <div key={w} className="font-bold text-gray-600">
                  {w}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {/* empty slots before first day */}
              {Array.from({ length: (startOfMonth.day() + 6) % 7 }).map(
                (_, i) => (
                  <div key={`empty-${i}`} />
                )
              )}

              {daysInMonth.map((d) => {
                const dayStr = d.format("YYYY-MM-DD");
                const isWeekend = d.day() === 0 || d.day() === 6;
                const isPastDay = d.isBefore(today, "day");
                const isSelected = selectedDay === dayStr;

                return (
                  <button
                    key={dayStr}
                    onClick={() => {
                      if (!isWeekend && !isPastDay) {
                        setSelectedDay(dayStr);
                        setSelectedSlot(null);
                      }
                    }}
                    disabled={isWeekend || isPastDay}
                    className={`p-2 rounded-lg  
                      ${
                        isWeekend || isPastDay
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "hover:bg-blue-100"
                      } 
                      ${isSelected ? "bg-blue-500 text-blue" : ""}
                    `}
                  >
                    {d.date()}
                  </button>
                );
              })}
            </div>

            {/* Slots */}
            {selectedDay && (
            <div className="mt-6">
                <h3 className="text-md font-semibold mb-2">
                {dayjs(selectedDay).format("dddd, MMMM D")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {slots.map((slot) => (
                    <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className=" rounded-lg py-2 hover:bg-blue-100"
                    >
                    {slot}
                    </button>
                ))}
                </div>
            </div>
            )}
          </>
        )}

        {/* Form */}
        {selectedSlot && (
            <>
            <BookingForm
            selectedDay={selectedDay}
            selectedSlot={selectedSlot}
            onBack={() => setSelectedSlot(null)} // esto hace que vuelva a mostrar slots
            />
            </>
        )}
      </div>
    </div>
  );
}
