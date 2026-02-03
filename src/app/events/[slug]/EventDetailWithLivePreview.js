"use client";

import { useLivePreview } from "../../../components/EventDetailClient";
import styles from "./page.module.css";
import Header from "../../../components/Header/Header";
import LivePreviewDiagnostics from "../../../components/LivePreviewDiagnostics";

/**
 * Client component wrapper for Live Preview functionality
 * This component handles real-time updates from Contentstack Visual Builder
 */
export default function EventDetailWithLivePreview({ initialEvent }) {
  // Subscribe to live preview updates
  const event = useLivePreview(initialEvent, "event_ayush");

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
        {...getDataCslpProps("event_ayush", event.uid, "banner_image")}
      >
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <h1 {...getDataCslpProps("event_ayush", event.uid, "title")}>
            {event.title}
          </h1>
        </div>
      </section>

      {/* CONTENT */}
      <main className={styles.container}>
        <section className={styles.metaSection}>
          <div className={styles.metaRow}>
            <span 
              className={styles.metaChip}
              {...getDataCslpProps("event_ayush", event.uid, "location")}
            >
              📍 {event.location}
            </span>

            <span 
              className={styles.metaChip}
              {...getDataCslpProps("event_ayush", event.uid, "start_time")}
            >
              📅 {new Date(event.start_time).toLocaleDateString()}
            </span>
          </div>

          <div
            className={styles.descriptionCard}
            dangerouslySetInnerHTML={{ __html: event.description }}
            {...getDataCslpProps("event_ayush", event.uid, "description")}
          />
        </section>

        <div className={styles.divider} />

        {/* SPEAKERS */}
        {event.speakers?.length > 0 && (
          <section className={styles.section}>
            <h2 {...getDataCslpProps("event_ayush", event.uid, "speakers")}>
              Speakers
            </h2>
            <div className={styles.grid}>
              {event.speakers.map((speaker, index) => (
                <div 
                  key={speaker.uid} 
                  className={styles.card}
                  {...getDataCslpProps("event_ayush", event.uid, `speakers.${index}`)}
                >
                  {speaker.photo?.url && (
                    <img
                      src={speaker.photo.url}
                      alt={speaker.title}
                      className={styles.speakerImage}
                      {...getDataCslpProps("speaker_ayush", speaker.uid, "photo")}
                    />
                  )}
                  <h3 {...getDataCslpProps("speaker_ayush", speaker.uid, "title")}>
                    {speaker.title}
                  </h3>
                  <p {...getDataCslpProps("speaker_ayush", speaker.uid, "designation")}>
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
            <h2 
              className={styles.sectionTitle}
              {...getDataCslpProps("event_ayush", event.uid, "schedule")}
            >
              Schedule
            </h2>

            <div className={styles.scheduleList}>
              {event.schedule.map((item, index) => (
                <div 
                  key={item.uid} 
                  className={styles.scheduleItem}
                  {...getDataCslpProps("event_ayush", event.uid, `schedule.${index}`)}
                >
                  <div 
                    className={styles.timeCol}
                    {...getDataCslpProps("schedule_ayush", item.uid, "time")}
                  >
                    {item.time}
                  </div>

                  <div className={styles.contentCol}>
                    <h4 {...getDataCslpProps("schedule_ayush", item.uid, "title")}>
                      {item.title}
                    </h4>
                    {item.description && (
                      <p {...getDataCslpProps("schedule_ayush", item.uid, "description")}>
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
            <h2 {...getDataCslpProps("event_ayush", event.uid, "cta_text")}>
              {event.cta_text}
            </h2>
            <a 
              href={event.cta_link} 
              className={styles.primaryBtn}
              {...getDataCslpProps("event_ayush", event.uid, "cta_link")}
            >
              Register Now
            </a>
          </section>
        )}
      </main>
        <LivePreviewDiagnostics />
    </>
  );
}

/**
 * Helper function to generate data-cslp attributes for Visual Builder
 * These attributes enable click-to-edit functionality in the Visual Builder
 */
function getDataCslpProps(contentTypeUid, entryUid, fieldPath) {
  if (typeof window === "undefined") return {};
  
  return {
    "data-cslp": `${contentTypeUid}.${entryUid}.${fieldPath}`,
  };
}
