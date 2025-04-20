import { useState } from "react";
import { useEventContext } from "../hooks/useEventContext.js";

const EventForm = () => {
  const { createEvent, loading } = useEventContext();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    start_time: "",
    end_time: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = [
      "title",
      "start_date",
      "start_time",
      "end_time",
    ];

    for (const field of required) {
      if (!formData[field]) {
        alert("Please fill out all required fields");
        return;
      }
    }

    await createEvent(formData);

    setFormData({
      title: "",
      description: "",
      start_date: "",
      start_time: "",
      end_time: "",
      location: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow-md space-y-4 w-full max-w-md flex flex-col"
    >
      <h2 className="text-xl font-semibold">Create New Event</h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Event Title"
        className="input"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="input"
      />

      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        className="input"
        required
      />

      <input
        type="time"
        name="start_time"
        value={formData.start_time}
        onChange={handleChange}
        className="input"
        required
      />

      <input
        type="time"
        name="end_time"
        value={formData.end_time}
        onChange={handleChange}
        className="input"
        required
      />

      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        className="input"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
};

export default EventForm;
