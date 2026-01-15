import Stack from "../../lib/contentstack";
import styles from "./page.module.css";

export default async function EventDetail({ params }) {
  const { slug } = await params; // ✅ FIX

  const Query = Stack.ContentType("event_ayush").Query();
  Query.where("slug", slug);
  Query.includeReference(["speakers", "schedule"]);
  Query.toJSON();

  const result = await Query.find();
  const event = result[0][0];

  if (!event) {
    return <p>Event not found</p>;
  }

  return (
    <main className={styles.page}>
      {event.banner_image?.url && (
        <img
          src={event.banner_image.url}
          alt={event.title}
          className={styles.banner}
        />
      )}

      <div className={styles.header}>
        <h1>{event.title}</h1>
        <p className={styles.meta}>
          📍 {event.location} | 🗓 {event.event_date}
        </p>
      </div>

      <p className={styles.description}>{event.description}</p>

      {/* Speakers */}
      {event.speakers?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Speakers</h2>
          {event.speakers.map((speaker) => (
            <div key={speaker.uid} className={styles.card}>
              <h4>{speaker.title}</h4>
              <p>{speaker.designation}</p>
              <p>{speaker.bio}</p>
            </div>
          ))}
        </section>
      )}

      {/* Schedule */}
      {event.schedule?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Schedule</h2>
          {event.schedule.map((item) => (
            <div key={item.uid} className={styles.card}>
              <strong>{item.time}</strong>
              <p>{item.title}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
