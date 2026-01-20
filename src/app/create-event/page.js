"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

  const [speakers, setSpeakers] = useState([
    { name: "", designation: "", bio: "", photo: null },
  ]);

  const [schedules, setSchedules] = useState([
    { time: "", title: "", description: "" },
  ]);

  /* ----------------------------
     SPEAKERS
  -----------------------------*/
  const addSpeaker = () => {
    setSpeakers([
      ...speakers,
      { name: "", designation: "", bio: "", photo: null },
    ]);
  };

  const updateSpeaker = (index, field, value) => {
    const updated = [...speakers];
    updated[index][field] = value;
    setSpeakers(updated);
  };

  /* ----------------------------
     SCHEDULES
  -----------------------------*/
  const addSchedule = () => {
    setSchedules([...schedules, { time: "", title: "", description: "" }]);
  };

  const updateSchedule = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  /* ----------------------------
     SUBMIT
  -----------------------------*/
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("location", location);
    formData.append("start_time", startTime);
    formData.append("end_time", endTime);
    formData.append("description", description);
    formData.append("cta_text", ctaText);
    formData.append("cta_link", ctaLink);

    if (bannerImage) {
      formData.append("banner_image", bannerImage);
    }

    speakers.forEach((speaker, index) => {
      formData.append(`speaker_name_${index}`, speaker.name);
      formData.append(`speaker_designation_${index}`, speaker.designation);
      formData.append(`speaker_bio_${index}`, speaker.bio);

      if (speaker.photo) {
        formData.append(`speaker_photo_${index}`, speaker.photo);
      }
    });

    schedules.forEach((schedule, index) => {
      formData.append(`schedule_time_${index}`, schedule.time);
      formData.append(`schedule_title_${index}`, schedule.title);
      formData.append(`schedule_description_${index}`, schedule.description);
    });

    const res = await fetch("/api/create-event", {
      method: "POST",
      body: formData,
    });

    let data = null;

    try {
      data = await res.json();
    } catch (err) {
      console.error("Invalid JSON response", err);
    }

    if (!res.ok) {
      const detailsText = data?.details
        ? JSON.stringify(data.details, null, 2)
        : "";
      const msg = [
        data?.message || data?.error || "Event creation failed ❌",
        detailsText ? `\n\nDetails:\n${detailsText}` : "",
      ].join("");
      alert(msg);
      console.error(data);
      return;
    }

    alert("Event created successfully ✅");
    if (data?.event?.slug) {
      router.push(`/events/${data.event.slug}`);
      router.refresh();
    }

    setTitle("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setCtaText("");
    setCtaLink("");
    setBannerImage(null);
    setSpeakers([{ name: "", designation: "", bio: "", photo: null }]);
    setSchedules([{ time: "", title: "", description: "" }]);
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Create Event</h1>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />

          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />

          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <h3>Banner Image</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBannerImage(e.target.files[0])}
          />

          <h3>Speakers</h3>
          {speakers.map((speaker, index) => (
            <div key={index} className={styles.block}>
              <input
                placeholder="Name"
                value={speaker.name}
                onChange={(e) => updateSpeaker(index, "name", e.target.value)}
              />
              <input
                placeholder="Designation"
                value={speaker.designation}
                onChange={(e) =>
                  updateSpeaker(index, "designation", e.target.value)
                }
              />
              <textarea
                placeholder="Bio"
                value={speaker.bio}
                onChange={(e) => updateSpeaker(index, "bio", e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateSpeaker(index, "photo", e.target.files[0])
                }
              />
            </div>
          ))}
          <button type="button" onClick={addSpeaker}>
            + Add Speaker
          </button>

          <h3>Schedule</h3>
          {schedules.map((item, index) => (
            <div key={index} className={styles.block}>
              <input
                placeholder="Time (e.g. 10:00 AM)"
                value={item.time}
                onChange={(e) => updateSchedule(index, "time", e.target.value)}
              />
              <input
                placeholder="Title"
                value={item.title}
                onChange={(e) => updateSchedule(index, "title", e.target.value)}
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateSchedule(index, "description", e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={addSchedule}>
            + Add Schedule
          </button>

          <h3>Call To Action</h3>
          <input
            placeholder="CTA Text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
          />
          <input
            placeholder="CTA Link"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
          />

          <button type="submit">Create Event</button>
        </form>
      </div>
    </main>
  );
}
