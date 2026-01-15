import Stack from "./lib/contentstack";
import styles from "./page.module.css";
import Link from "next/link";

export default async function HomePage() {
  /* -----------------------------------
     Fetch ONLY 3 featured events by slug
  ------------------------------------ */
  const Query = Stack.ContentType("event_ayush").Query();

  Query.containedIn("slug", [
    "party",
    "contentstack-event-ayush",
    "flowfest-2026-ayush",
  ]);

  Query.toJSON();

  const result = await Query.find();
  const events = result[0] || [];

  return (
    <main className={styles.page}>
      {/* ================= HERO SECTION ================= */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <h1>The Smart Event Management Platform</h1>

          <p>
            Create, manage, automate, and publish events effortlessly using
            Contentstack and Next.js.
          </p>

          <Link href="/create-event">
            <button className={styles.heroButton}>Get Started</button>
          </Link>
        </div>
      </section>

      {/* ================= FEATURED EVENTS ================= */}
      <section className={styles.featured}>
        <h2>Featured Events</h2>

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
                  {event.description ||
                    "A professionally managed event powered by Contentstack."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={styles.footer}>
        © 2026 Eventify · Powered by Contentstack · Built with Next.js
      </footer>
    </main>
  );
}