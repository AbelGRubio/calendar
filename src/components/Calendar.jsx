import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import BookingForm from "./BookingForm";
import api from "./axio.interceptor";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const today = dayjs().startOf("day");
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  // Fetch available slots for selected day
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await api.get(`/available-slots?date=${selectedDay}`);
        setAvailableSlots(res.data.available_slots || []);
      } catch (error) {
        console.error("Error fetching slots", error);
        setAvailableSlots([]);
      }
    };

    if (selectedDay) fetchSlots();
  }, [selectedDay]);

  // Fetch holidays
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await api.get("/holidays");
        setHolidays(res.data.map((h) => h.date));
      } catch (error) {
        console.error("Error fetching holidays", error);
        setHolidays([]);
      }
    };
    fetchHolidays();
  }, []); // re-fetch if month changes

  // Generate days of the current month
  const daysInMonth = [];
  for (
    let d = startOfMonth;
    d.isBefore(endOfMonth) || d.isSame(endOfMonth);
    d = d.add(1, "day")
  ) {
    daysInMonth.push(d);
  }

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Check if a date is a holiday
  const isHoliday = (dateStr) => holidays.includes(dateStr);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 boder rounded-lg p-4 shadow-xl">
      {/* Left: Summary */}
      <div>
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
        <p className="text-xs text-gray-500 mt-4 italic">
          * The selected time may be subject to change.
        </p>
      </div>

      {/* Right: Calendar + Slots/Form */}
      <div className="col-span-2">
        {!selectedSlot && (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() =>
                  setCurrentMonth(currentMonth.subtract(1, "month"))
                }
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
                const holiday = isHoliday(dayStr);

                return (
                  <button
                    key={dayStr}
                    onClick={() => {
                      if (!isWeekend && !isPastDay && !holiday) {
                        setSelectedDay(dayStr);
                        setSelectedSlot(null);
                      }
                    }}
                    disabled={isWeekend || isPastDay || holiday}
                    title={holiday ? "Holiday" : ""}
                    className={`p-2 rounded-lg  
                      ${
                        isWeekend || isPastDay || holiday
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "hover:bg-blue-100"
                      } 
                      ${isSelected ? "bg-blue-500 text-white" : ""}`}
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
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className="rounded-lg py-2 hover:bg-blue-100"
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-400">No slots available</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Form */}
        {selectedSlot && (
          <BookingForm
            selectedDay={selectedDay}
            selectedSlot={selectedSlot}
            onBack={() => setSelectedSlot(null)}
          />
        )}
      </div>
    </div>
  );
}
