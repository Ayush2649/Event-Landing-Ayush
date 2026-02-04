"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Stack, { addEditableTags } from "../../lib/contentstack";
import { LivePreviewInit, onEntryChange } from "../../lib/livepreview";
import styles from "./page.module.css";
import Header from "../../../components/Header/Header";

export default function EventDetail() {
  const params = useParams();
  const slug = params.slug;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    LivePreviewInit();

    async function fetchEvent() {
      try {
        setLoading(true);
        const Query = Stack.ContentType("event_ayush").Query();
        Query.where("slug", slug);
        Query.includeReference(["speakers", "schedule"]);
        Query.toJSON();

        const result = await Query.find();
        const eventEntry = result?.[0]?.[0];
        
        // Add editable tags to the entry for Live Preview
        if (eventEntry) {
          addEditableTags(eventEntry, "event_ayush", true, "en-us");
        }
        
        setEvent(eventEntry);
        setError(null);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();

    // Set up live preview entry change listener
    const unsubscribe = onEntryChange(() => {
      console.log("Entry changed, refetching event...");
      fetchEvent();
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.container}>Loading event...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.container}>Error: {error}</div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Header />
        <div className={styles.notFound}>Event not found</div>
      </>
    );
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
        {...(event.$?.banner_image ?? {})}
      >
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <h1 {...(event.$?.title ?? {})}>
            {event.title}
          </h1>
        </div>
      </section>

      {/* CONTENT */}
      <main className={styles.container}>
        <section className={styles.metaSection}>
          <div className={styles.metaRow}>
            <span className={styles.metaChip} {...(event.$?.location ?? {})}>
              📍 {event.location}
            </span>

            <span className={styles.metaChip} {...(event.$?.start_time ?? {})}>
              📅 {new Date(event.start_time).toLocaleDateString()}
            </span>
          </div>

          <div
            className={styles.descriptionCard}
                        {...(event.$?.description ?? {})}
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </section>

        <div className={styles.divider} />

        {/* SPEAKERS */}
        {event.speakers?.length > 0 && (
          <section className={styles.section}>
            <h2>Speakers</h2>
            <div className={styles.grid}>
              {event.speakers.map((speaker, index) => (
                <div key={speaker.uid} className={styles.card} {...(event.$?.[`speakers__${index}`] ?? {})}>
                  {speaker.photo?.url && (
                    <img
                                            {...(speaker.$?.photo ?? {})}
                      src={speaker.photo.url}
                      alt={speaker.title}
                      className={styles.speakerImage}
                    />
                  )}
                  <h3 {...(speaker.$?.title ?? {})}>
                    {speaker.title}
                  </h3>
                  <p {...(speaker.$?.designation ?? {})}>
                    {speaker.designation}
                  </p>
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
              {event.schedule.map((item, index) => (
                <div key={item.uid} className={styles.scheduleItem} {...(event.$?.[`schedule__${index}`] ?? {})}>
                  <div className={styles.timeCol} {...(item.$?.time ?? {})}>
                    {item.time}
                  </div>

                  <div className={styles.contentCol}>
                    <h4 {...(item.$?.title ?? {})}>
                      {item.title}
                    </h4>
                    {item.description && (
                      <p {...(item.$?.description ?? {})}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className={styles.divider} />

        {event.cta_text && event.cta_link && (
          <section className={styles.cta}>
            <h2 {...(event.$?.cta_text ?? {})}>
              {event.cta_text}
            </h2>
            <a href={event.cta_link} className={styles.primaryBtn} {...(event.$?.cta_link ?? {})}>
              Register Now
            </a>
          </section>
        )}
      </main>
    </>
  );
}
