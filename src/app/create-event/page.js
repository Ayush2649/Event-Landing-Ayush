"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    event_date: "",
    description: "",
    speaker_name: "",
    speaker_bio: "",
    schedule_time: "",
    schedule_title: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/create-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Event created with speakers & schedule!");
    } else {
      alert("Failed to create event");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Create Event</h1>

        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Event Title" onChange={handleChange} required />
          <input name="location" placeholder="Location" onChange={handleChange} required />
          <input type="datetime-local" name="event_date" onChange={handleChange} required />
          <textarea name="description" placeholder="Event Description" onChange={handleChange} required />

          <h3>Speaker</h3>
          <input name="speaker_name" placeholder="Speaker Name" onChange={handleChange} />
          <textarea name="speaker_bio" placeholder="Speaker Bio" onChange={handleChange} />
          <input name="speaker_designation" placeholder="Speaker Designation" onChange={handleChange} />

          <h3>Schedule</h3>
          <input name="schedule_time" placeholder="Time (e.g. 10:00 AM)" onChange={handleChange} />
          <input name="schedule_title" placeholder="Session Title" onChange={handleChange} />

          <button type="submit">Create Event</button>
        </form>
      </div>
    </main>
  );
}
