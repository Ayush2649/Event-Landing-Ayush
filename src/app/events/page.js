import Stack from "../lib/contentstack";
import styles from "./page.module.css";
import Link from "next/link";

export default async function EventsPage() {
  const Query = Stack.ContentType("event_ayush").Query();
  Query.toJSON();
  Query.descending("event_date");

  const result = await Query.find();
  const events = result[0];

  return (
    <main className={styles.page}>
      <h1>All Events</h1>

      <div className={styles.eventGrid}>
        {events.map((event) => (
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
              <h3>{event.title}</h3>
              <p>
                {event.short_description ||
                  "A professionally managed event powered by Contentstack."}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}