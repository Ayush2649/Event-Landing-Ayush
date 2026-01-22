import Stack from "../lib/contentstack";
import styles from "./page.module.css";
import EventSearch from "../../components/EventSearch";

export default async function EventsPage() {
  const Query = Stack.ContentType("event_ayush").Query();
  Query.descending("start_time");
  Query.toJSON();

  async function fetchEvents() {
    const result = await Query.find();
    return result?.[0] || [];
  }

  fetchEvents();

  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>All Events</h1>

      <EventSearch />

      {/* <div className={styles.eventGrid}>
        {events.map((event) => {
          const status = getEventStatus(event.start_time, event.end_time);

          return (
            <Link
              key={event.uid}
              href={`/events/${event.slug}`}
              className={styles.eventCard}
            >

              {event.banner_image?.url && (
                <img
                  src={event.banner_image.url}
                  alt={event.title}
                  className={styles.eventImage}
                />
              )}

              <div className={styles.eventContent}>
                <h3 className={styles.eventTitle}>{event.title}</h3>

                <span className={`${styles.badge} ${styles[status]}`}>
                  {status === "upcoming" && "Upcoming"}
                  {status === "live" && "Live"}
                  {status === "ended" && "Ended"}
                </span>

                {status === "upcoming" && (
                  <CountdownTimer eventDate={event.start_time} />
                )}

                {status === "live" && (
                  <p className={styles.liveText}>🔴 Live Now</p>
                )}

                {status === "ended" && (
                  <p className={styles.endedText}>Event Ended</p>
                )}

                <p className={styles.eventDescription}>
                  {event.short_description ||
                    "A professionally managed event powered by Contentstack."}
                </p>
              </div>
            </Link>
          );
        })}
      </div> */}
    </main>
  );
}