import Stack from "./lib/contentstack";
import styles from "./page.module.css";
import Link from "next/link";

export default async function HomePage() {
  /* -----------------------------------
     Fetch ONLY 3 featured events by slug
  ------------------------------------ */
  const Query = Stack.ContentType("event_ayush").Query();

  Query.containedIn("slug", [
    "mongodb-new-product-launch",
    "contentstack-event-ayush",
    "flowfest-2026-ayush",
  ]);

  Query.toJSON();

  const result = await Query.find();
  const events = result[0] || [];

  function stripHtml(html = "") {
    return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ");
  }

  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1>The Smart Event Management Platform</h1>
            <p>
              Create, manage, automate, and publish events effortlessly using
              Contentstack and Next.js.
            </p>

            <Link href="/create-event">
              <button className={styles.primaryBtn}>Create Event</button>
            </Link>
          </div>

          <div className={styles.heroImage}>
            <img src="/product-preview.png" alt="Eventify Dashboard" />
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Why Eventify?</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>Structured Content</h3>
            <p>All event data is modeled and managed using Contentstack CMS.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Powerful Automation</h3>
            <p>Auto-publish events, trigger emails, and manage workflows.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Live Preview</h3>
            <p>Preview event pages instantly before publishing.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Instant Launch</h3>
            <p>Deploy event pages quickly using Contentstack Launch.</p>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
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
                  {event.short_description ||
                    "A professionally managed event powered by Contentstack."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.ctaBlock}>
        <h2>Ready to build your next event?</h2>
        {/* <p>Create and manage professional events in minutes.</p> */}

        <Link href="/create-event">
          <button className={styles.primaryBtn}>Get Started</button>
        </Link>
      </section>

      <footer className={styles.footer}>
        © 2026 Eventify · Powered by Contentstack · Built with Next.js
      </footer>
    </main>
  );
}
