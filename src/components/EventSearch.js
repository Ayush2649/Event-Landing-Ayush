"use client";

import { InstantSearch, SearchBox, Hits, Configure } from "react-instantsearch";
import { searchClient } from "../app/lib/algolia";
import CountdownTimer from "./Header/CountDownTimer";
import { getEventStatus } from "../utils/eventStatus";
import styles from "./EventSearch.module.css";
import { useEffect, useState } from "react";

function EventCard({ hit }) {
  const status = getEventStatus(hit.start_time, hit.end_time);

  return (
    <a href={`/events/${hit.slug}`} className={styles.eventCard}>
      {/* IMAGE */}
      {hit.banner_image?.url && (
        <div className={styles.imageWrapper}>
          <img
            src={hit.banner_image.url}
            alt={hit.title}
            className={styles.eventImage}
          />

          {/* STATUS BADGE ON IMAGE */}
          <span className={`${styles.badge} ${styles[status]}`}>{status}</span>
        </div>
      )}

      {/* CONTENT */}
      <div className={styles.eventContent}>
        {/* TITLE */}
        <h3 className={styles.eventTitle}>{hit.title}</h3>

        {/* META INFO */}
        <div className={styles.metaRow}>
          {hit.location && (
            <span className={styles.location}>📍 {hit.location}</span>
          )}

          {status === "upcoming" && (
            <CountdownTimer eventDate={hit.start_time} />
          )}

          {status === "live" && <span className={styles.live}>🔴 Live</span>}
        </div>

        {/* DESCRIPTION */}
        <p className={styles.description}>
          {hit.short_description ||
            "A professionally managed event powered by Contentstack."}
        </p>
      </div>
    </a>
  );
}

export default function EventSearch() {
  const [interest, setInterest] = useState(null);

  // 1️⃣ Read from URL OR localStorage (once)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const variant = params.get("_cs_p13n");

    if (variant) {
      let category = null;

      if (variant.includes("tech")) category = "tech";
      if (variant.includes("music")) category = "music";
      if (variant.includes("sports")) category = "sports";
      if (variant.includes("festival")) category = "festivals";

      if (category) {
        setInterest(category);

        // Clean URL
        params.delete("_cs_p13n");
        const cleanUrl =
          window.location.pathname +
          (params.toString() ? `?${params.toString()}` : "");

        window.history.replaceState({}, "", cleanUrl);
        return;
      }
    }

    // Fallback to localStorage
    const saved = localStorage.getItem("user_interest");
    if (saved) setInterest(saved);
  }, []);

  // 2️⃣ Persist interest changes
  useEffect(() => {
    if (interest) {
      localStorage.setItem("user_interest", interest);
    }
  }, [interest]);

  const handleInterest = (value) => {
    if (value === "all") {
      localStorage.removeItem("user_interest");
      setInterest(null);
    } else {
      localStorage.setItem("user_interest", value);
      setInterest(value);
    }
  };

  const getPersonalizeCategory = () => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    const variant = params.get("_cs_p13n");

    if (!variant) return null;

    if (variant.includes("tech")) return "tech";
    if (variant.includes("music")) return "music";
    if (variant.includes("sports")) return "sports";
    if (variant.includes("festival")) return "festivals";

    return null;
  };

  return (
    <>
      {/* FILTER BUTTONS */}
      <div className={styles.filterBar}>
        {["tech", "music", "sports", "festivals"].map((cat) => (
          <button
            key={cat}
            onClick={() => handleInterest(cat)}
            className={`${styles.filterBtn} ${
              interest === cat ? styles.active : ""
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => handleInterest("all")}
          className={`${styles.filterBtn} ${!interest ? styles.active : ""}`}
        >
          All
        </button>
      </div>

      {/* ================= RECOMMENDED ================= */}
      {interest && (
        <>
          <h2 className={styles.sectionTitle}>Recommended for you</h2>

          <InstantSearch searchClient={searchClient} indexName="events">
            <Configure
              filters={`_content_type:"event_ayush" AND category:"${interest}"`}
              hitsPerPage={3}
            />
            <div className={styles.eventGrid}>
              <Hits hitComponent={EventCard} />
            </div>
          </InstantSearch>
        </>
      )}

      {/* ================= ALL EVENTS ================= */}
      <InstantSearch searchClient={searchClient} indexName="events">
        <Configure filters={`_content_type:"event_ayush"`} hitsPerPage={9} />

        <div className={styles.searchBarWrapper}>
          <SearchBox placeholder="Search events..." />
        </div>

        <div className={styles.eventGrid}>
          <Hits hitComponent={EventCard} />
        </div>
      </InstantSearch>
    </>
  );
}
