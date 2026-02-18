"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Notification from "../../components/Notification";

export default function CreateEvent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [notification, setNotification] = useState(null);

  const [speakers, setSpeakers] = useState([
    { name: "", designation: "", bio: "", photo: null, photoPreview: null },
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
      { name: "", designation: "", bio: "", photo: null, photoPreview: null },
    ]);
  };

  const updateSpeaker = (index, field, value) => {
    const updated = [...speakers];
    updated[index][field] = value;
    setSpeakers(updated);
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeakerPhotoChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      updateSpeaker(index, "photo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSpeaker(index, "photoPreview", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSpeaker = (index) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  const removeSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
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
    formData.append("category", category);
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
        data?.message || data?.error || "Event creation failed",
        detailsText ? `\nDetails:\n${detailsText}` : "",
      ].join("");
      setNotification({ message: msg, type: "error" });
      console.error(data);
      return;
    }

    setNotification({ message: "Event created successfully!", type: "success" });
    if (data?.event?.slug) {
      setTimeout(() => {
        router.push(`/events/${data.event.slug}`);
        router.refresh();
      }, 1000);
    }

    setTitle("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    setCategory("");
    setDescription("");
    setCtaText("");
    setCtaLink("");
    setBannerImage(null);
    setBannerPreview(null);
    setSpeakers([
      { name: "", designation: "", bio: "", photo: null, photoPreview: null },
    ]);
    setSchedules([{ time: "", title: "", description: "" }]);
  }

  return (
    <main className={styles.page}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
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

          <input
            placeholder="Category (e.g. Tech, Music, Sports, Festivals)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className={styles.fileUploadSection}>
            <h3>Banner Image</h3>
            <label className={styles.fileUploadLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerImageChange}
                className={styles.fileInput}
              />
              <div className={styles.fileUploadButton}>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {bannerImage ? "Change Banner Image" : "Upload Banner Image"}
              </div>
              {bannerImage && (
                <span className={styles.fileName}>{bannerImage.name}</span>
              )}
            </label>
            {bannerPreview && (
              <div className={styles.imagePreview}>
                <img src={bannerPreview} alt="Banner preview" />
              </div>
            )}
          </div>

          <div className={styles.sectionHeader}>
            <h3>Speakers</h3>
            <button
              type="button"
              onClick={addSpeaker}
              className={styles.addBtn}
            >
              + Add Speaker
            </button>
          </div>
          {speakers.map((speaker, index) => (
            <div key={index} className={styles.block}>
              <div className={styles.blockHeader}>
                <h4>Speaker {index + 1}</h4>
                {speakers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className={styles.speakerGrid}>
                <div className={styles.speakerInfo}>
                  <input
                    placeholder="Speaker Name"
                    value={speaker.name}
                    onChange={(e) =>
                      updateSpeaker(index, "name", e.target.value)
                    }
                  />
                  <input
                    placeholder="Designation (e.g., CEO, Developer)"
                    value={speaker.designation}
                    onChange={(e) =>
                      updateSpeaker(index, "designation", e.target.value)
                    }
                  />
                  <textarea
                    placeholder="Speaker Bio"
                    value={speaker.bio}
                    onChange={(e) =>
                      updateSpeaker(index, "bio", e.target.value)
                    }
                  />
                </div>
                <div className={styles.speakerPhoto}>
                  <label className={styles.fileUploadLabel}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSpeakerPhotoChange(index, e)}
                      className={styles.fileInput}
                    />
                    <div className={styles.fileUploadButtonSmall}>
                      {speaker.photo ? "Change Photo" : "Upload Photo"}
                    </div>
                  </label>
                  {speaker.photoPreview && (
                    <div className={styles.imagePreviewSmall}>
                      <img src={speaker.photoPreview} alt="Speaker preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className={styles.sectionHeader}>
            <h3>Schedule</h3>
            <button
              type="button"
              onClick={addSchedule}
              className={styles.addBtn}
            >
              + Add Schedule
            </button>
          </div>
          {schedules.map((item, index) => (
            <div key={index} className={styles.block}>
              <div className={styles.blockHeader}>
                <h4>Schedule Item {index + 1}</h4>
                {schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                placeholder="Time (e.g. 10:00 AM - 11:00 AM)"
                value={item.time}
                onChange={(e) => updateSchedule(index, "time", e.target.value)}
              />
              <input
                placeholder="Event Title"
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
