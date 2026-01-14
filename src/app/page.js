import Stack from "./lib/contentstack";
import styles from "./page.module.css";
import Header from "../../components/Header/Header";
import Link from "next/link";``

export default async function HomePage() {
  const Query = Stack.ContentType("event_ayush").Query();
  Query.toJSON();
  Query.limit(3);
  Query.descending("event_date");

  const result = await Query.find();
  const events = result[0];

  return (
    <main className={styles.page}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <h1>The Smart Event Management Platform</h1>
          <p>
            Create, manage, automate, and publish events effortlessly using
            Contentstack and Next.js.
          </p>

          <Link href="/create-event"><button className={styles.heroButton}>Get Started</button></Link>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className={styles.featured}>
        <h2>Events We’ve Managed</h2>

        <div className={styles.eventGrid}>
          {events.map((event) => (
            <div key={event.uid} className={styles.eventCard}>
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
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        © 2026 Eventify · Powered by Contentstack · Built with Next.js
      </footer>
    </main>
  );
}
