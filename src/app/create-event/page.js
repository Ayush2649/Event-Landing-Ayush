"use client";

import { useState } from "react";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    event_date: "",
    description: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/create-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Event submitted!");
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Create an Event</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Event Title"
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          name="event_date"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />

        <button type="submit">Create Event</button>
      </form>
    </main>
  );
}
