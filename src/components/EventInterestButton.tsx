"use client";

import { useEffect, useState } from "react";
import {
  isEventInterested,
  toggleEventInterested,
} from "../utils/eventInterest";
import styles from "./EventInterestButton.module.css";

export const EventInterestButton = ({event}) => {
  const eventId = event.objectID;
  const [interested, setInterested] = useState(false);

  useEffect(() => {
    setInterested(isEventInterested(eventId));
  }, [eventId]);

  const handleToggle = (e) => {
    console.log("Star clicked for:", eventId);
    e.preventDefault();
    e.stopPropagation();

    toggleEventInterested(eventId);

    const updatedStatus = isEventInterested(eventId);
    setInterested(updatedStatus);
  };

  return (
    <button
      className={styles.starButton}
      onClick={handleToggle}
      aria-label="Mark as interested"
    >
      <span className={styles.star}>{interested ? "★" : "☆"}</span>

      <span className={styles.tooltip}>
        {interested ? "Interested" : "Mark as Interested"}
      </span>
    </button>
  );
};
