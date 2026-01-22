"use client";

import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { searchClient } from "../app/lib/algolia";
import CountdownTimer from "./Header/CountDownTimer";
import { getEventStatus } from "../utils/eventStatus";
import { Configure } from "react-instantsearch";
import styles from "./EventSearch.module.css";


function EventCard({ hit }) {
  const status = getEventStatus(hit.start_time, hit.end_time);

  return (
    <a href={`/events/${hit.slug}`} className={styles.eventCard}>
      {hit.banner_image?.url && (
        <img
          src={hit.banner_image.url}
          alt={hit.title}
          className={styles.eventImage}
        />
      )}
      <div className={styles.eventContent}>
        <h3>{hit.title}</h3>
        <span className={`${styles.badge} ${styles[status]}`}>
          {status === "upcoming" && "Upcoming"}
          {status === "live" && "Live"}
          {status === "ended" && "Ended"}
        </span>

        {status === "upcoming" && <CountdownTimer eventDate={hit.start_time} />}

        {status === "live" && <p className={styles.liveText}>🔴 Live Now</p>}

        {status === "ended" && <p className={styles.endedText}>Event Ended</p>}
        <p>
          {hit.short_description ||
            "A professionally managed event powered by Contentstack."}
        </p>
      </div>
    </a>
  );
}

export default function EventSearch() {
  return (
    <InstantSearch searchClient={searchClient} indexName="events">
      <Configure filters='_content_type:"event_ayush"' />

      <div className={styles.searchCard}>
        <SearchBox placeholder="Search events..." />

        <div className={styles.eventGrid}>
          <Hits hitComponent={EventCard} />
        </div>
      </div>
    </InstantSearch>
  );
}
