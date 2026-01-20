import Stack from "../../lib/contentstack";
import styles from "./page.module.css";
import Header from "@/components/Header/Header";

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

  const ctaBlock = event.landing_sections?.find((block) => block.cta_section);

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
        <p className={styles.meta}>
          📍 {event.location} · 📅{" "}
          {new Date(event.start_time).toLocaleDateString()}
        </p>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: event.description }}
        />

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

        {/* CTA SECTION */}
        {ctaBlock && (
          <section className={styles.cta}>
            <div className={styles.ctaContent}>
              <h2>{ctaBlock.cta_section.cta_text}</h2>

              {ctaBlock.cta_section.cta_description && (
                <p>{ctaBlock.cta_section.cta_description}</p>
              )}

              <div className={styles.ctaActions}>
                <a
                  href={ctaBlock.cta_section.cta_link}
                  className={styles.primaryBtn}
                >
                  {ctaBlock.cta_section.cta_button_text || "Register Now"}
                </a>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
