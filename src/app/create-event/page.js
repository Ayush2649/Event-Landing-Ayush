"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    event_date: "",
    description: "",
    banner_imaage: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await fetch("/api/create-event", {
      method: "POST",
      body: formData,
    });

    alert("Event created successfully!");
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Create Event</h1>

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
      </div>
    </main>
  );
}
