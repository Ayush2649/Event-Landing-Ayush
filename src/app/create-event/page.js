"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    start_time: "",
    end_time: "",
    description: "",
    speakers: "",
    schedules: "",
    cta_text: "",
    cta_link: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Speakers
  const handleSpeakerChange = (index, field, value) => {
    const updated = [...form.speakers];
    updated[index][field] = value;
    setForm({ ...form, speakers: updated });
  };

  const addSpeaker = () => {
    setForm({
      ...form,
      speakers: [...form.speakers, { title: "", designation: "", bio: "" }],
    });
  };

  // Schedules
  const handleScheduleChange = (index, field, value) => {
    const updated = [...form.schedules];
    updated[index][field] = value;
    setForm({ ...form, schedules: updated });
  };

  const addSchedule = () => {
    setForm({
      ...form,
      schedules: [...form.schedules, { time: "", title: "", description: "" }],
    });
  };

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
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Event Description"
            onChange={handleChange}
            required
          />

          <h3>Speaker</h3>
          <input
            name="speaker_name"
            placeholder="Speaker Name"
            onChange={handleChange}
          />
          <textarea
            name="speaker_bio"
            placeholder="Speaker Bio"
            onChange={handleChange}
          />
          <input
            name="speaker_designation"
            placeholder="Speaker Designation"
            onChange={handleChange}
          />

          <h3>Schedule</h3>
          <input
            name="schedule_time"
            placeholder="Time (e.g. 10:00 AM)"
            onChange={handleChange}
          />
          <input
            name="schedule_title"
            placeholder="Session Title"
            onChange={handleChange}
          />

          <h3>Call To Action</h3>

          <input
            name="cta_text"
            placeholder="CTA Text (e.g. Register Now)"
            value={form.cta_text}
            onChange={handleChange}
          />

          <input
            name="cta_link"
            placeholder="CTA Link (e.g. https://register.com)"
            value={form.cta_link}
            onChange={handleChange}
          />

          <button type="submit">Create Event</button>
        </form>
      </div>
    </main>
  );
}
