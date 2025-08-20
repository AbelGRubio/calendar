import { useState } from "react";
import dayjs from "dayjs";
import { toast } from 'sonner';

export default function BookingForm({ selectedDay, selectedSlot, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Show a "booking in progress" toast
    const loadingToast = toast.loading("Booking in progress...");

    try {

      const res = await fetch("/v1/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          date: selectedDay,  
          time: selectedSlot, 
        }),
      });

      if (!res.ok) throw new Error("Error saving booking");

      setSuccess(true);

      // Replace the loading toast with a success toast
      toast.success("Booking successful", { id: loadingToast });
    } catch (err) {
      console.error(err);

      // Replace the loading toast with an error toast
      toast.error("There was a problem making the booking", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 border rounded-lg bg-green-50">
        <h3 className="font-bold text-green-700 mb-2">
          Booking confirmed ✅
        </h3>
        <p>
          {name}, we have scheduled your meeting on{" "}
          {dayjs(selectedDay).format("dddd, MMMM D, YYYY")} at {selectedSlot}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <input
        type="text"
        placeholder="Name*"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="p-2 border rounded w-full"
      />
      <input
        type="email"
        placeholder="Email*"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-2 border rounded w-full"
      />

      <textarea
        placeholder="Additional information..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="p-2 border rounded w-full"
        rows="3"
      ></textarea>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Confirm"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Choose another time
        </button>
      </div>
    </form>
  );
}
