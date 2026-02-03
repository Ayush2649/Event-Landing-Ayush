import Stack from "../../lib/contentstack";
import styles from "./page.module.css";
import Header from "../../../components/Header/Header";

export default async function EventDetail({ params }) {
  const { slug } = await params;

  const Query = Stack.ContentType("event_ayush").Query();
  Query.where("slug", slug);
  Query.includeReference(["speakers", "schedule"]);
  Query.toJSON();

  const result = await Query.find();
  const event = result?.[0]?.[0];

  if (!event) {
    return <div className={styles.notFound}>Event not found</div>;
  }

  return (
    <>
      <Header />

      {/* HERO BANNER */}
      <section
        className={styles.hero}
        style={{
          backgroundImage: `url(${event.banner_image?.url})`,
        }}
      >
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <h1>{event.title}</h1>
        </div>
      </section>

      {/* CONTENT */}
      <main className={styles.container}>
        <section className={styles.metaSection}>
          <div className={styles.metaRow}>
            <span className={styles.metaChip}>📍 {event.location}</span>

            <span className={styles.metaChip}>
              📅 {new Date(event.start_time).toLocaleDateString()}
            </span>
          </div>

          <div
            className={styles.descriptionCard}
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </section>

        <div className={styles.divider} />

        {/* SPEAKERS */}
        {event.speakers?.length > 0 && (
          <section className={styles.section}>
            <h2>Speakers</h2>
            <div className={styles.grid}>
              {event.speakers.map((speaker) => (
                <div key={speaker.uid} className={styles.card}>
                  {speaker.photo?.url && (
                    <img
                      src={speaker.photo.url}
                      alt={speaker.title}
                      className={styles.speakerImage}
                    />
                  )}
                  <h3>{speaker.title}</h3>
                  <p>{speaker.designation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SCHEDULE */}
        {event.schedule?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Schedule</h2>

            <div className={styles.scheduleList}>
              {event.schedule.map((item) => (
                <div key={item.uid} className={styles.scheduleItem}>
                  <div className={styles.timeCol}>{item.time}</div>

                  <div className={styles.contentCol}>
                    <h4>{item.title}</h4>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className={styles.divider} />

        {event.cta_text && event.cta_link && (
          <section className={styles.cta}>
            <h2>{event.cta_text}</h2>
            <a href={event.cta_link} className={styles.primaryBtn}>
              Register Now
            </a>
          </section>
        )}
      </main>
    </>
  );
}
