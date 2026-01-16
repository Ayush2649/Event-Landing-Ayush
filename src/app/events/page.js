import Stack from "../lib/contentstack";
import styles from "./page.module.css";
import CountdownTimer from "@/components/Header/CountDownTimer";
import { getEventStatus } from "@/utils/eventStatus";
import Link from "next/link";

export default async function EventsPage() {
  const Query = Stack.ContentType("event_ayush").Query();
  Query.descending("start_time");
  Query.toJSON();

  const result = await Query.find();
  const events = result[0];

  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>All Events</h1>

      <div className={styles.eventGrid}>
        {events.map((event) => {
          const status = getEventStatus(
            event.start_time,
            event.end_time
          );

          return (
            <Link
              key={event.uid}
              href={`/events/${event.slug}`}
              className={styles.eventCard}
            >
              {/* IMAGE */}
              {event.banner_image?.url && (
                <img
                  src={event.banner_image.url}
                  alt={event.title}
                  className={styles.eventImage}
                />
              )}

              {/* CONTENT */}
              <div className={styles.eventContent}>
                <h3 className={styles.eventTitle}>{event.title}</h3>

                {/* STATUS BADGE */}
                <span className={`${styles.badge} ${styles[status]}`}>
                  {status === "upcoming" && "Upcoming"}
                  {status === "live" && "Live"}
                  {status === "ended" && "Ended"}
                </span>

                {/* TIMER / STATUS */}
                {status === "upcoming" && (
                  <CountdownTimer eventDate={event.start_time} />
                )}

                {status === "live" && (
                  <p className={styles.liveText}>🔴 Live Now</p>
                )}

                {status === "ended" && (
                  <p className={styles.endedText}>Event Ended</p>
                )}

                {/* DESCRIPTION */}
                <p className={styles.eventDescription}>
                  {event.short_description ||
                    "A professionally managed event powered by Contentstack."}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
