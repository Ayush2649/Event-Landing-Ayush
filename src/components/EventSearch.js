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
          <span className={`${styles.badge} ${styles[status]}`}>
            {status}
          </span>
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

  useEffect(() => {
    const saved = localStorage.getItem("user_interest");
    if (saved) setInterest(saved);
  }, []);

  const handleInterest = (value) => {
    if (value === "all") {
      localStorage.removeItem("user_interest");
      setInterest(null);
    } else {
      localStorage.setItem("user_interest", value);
      setInterest(value);
    }
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