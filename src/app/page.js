"use client";
import Stack, { addEditableTags } from "./lib/contentstack";
import styles from "./page.module.css";
import HeroImageSlider from "./HeroImageSlider";;
import Link from "next/link";
import {LivePreviewInit, onEntryChange} from "./lib/livepreview";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    LivePreviewInit();

    /* -----------------------------------
       Fetch ONLY 3 featured events by slug
    ------------------------------------ */
    async function fetchEvents() {
      try {
        setLoading(true);
        const Query = Stack.ContentType("event_ayush").Query();

        Query.containedIn("slug", [
          "karan-aujla-s-concert",
          "contentstack-event-ayush",
          "technova-2026-building-the-future-with-ai-web",
        ]);

        Query.toJSON();

        const result = await Query.find();
        const eventEntries = result[0] || [];
        
        // Add editable tags to each entry for Live Preview
        eventEntries.forEach((entry) => {
          addEditableTags(entry, "event_ayush", true, "en-us");
        });
        
        setEvents(eventEntries);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();

    // Set up live preview entry change listener
    const unsubscribe = onEntryChange(() => {
      console.log("Entry changed, refetching events...");
      fetchEvents();
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  function stripHtml(html = "") {
    return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ");
  }

  const LayersIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 7l10 5 10-5-10-5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" />
      <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  const ZapIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2L3 14h7l-1 8 10-12h-7l1-8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  const EyeIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  const RocketIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 19l4-4M15 9l4-4M9 15l6-6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

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

          <HeroImageSlider />
        </div>
      </section>

      <section className={styles.features}>
        <h2>Why Eventify?</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <LayersIcon />
            </div>
            <h3>Structured Content</h3>
            <p>All event data is modeled and managed using Contentstack CMS.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <ZapIcon />
            </div>
            <h3>Powerful Automation</h3>
            <p>Auto-publish events, trigger emails, and manage workflows.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <EyeIcon />
            </div>
            <h3>Personalize</h3>
            <p>Filter events based on your preferences and interests.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <RocketIcon />
            </div>
            <h3>Instant Launch</h3>
            <p>Deploy event pages quickly using Contentstack Launch.</p>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className={styles.featured}>
        <h2>Featured Events</h2>

        {loading && <p>Loading events...</p>}
        {error && <p className={styles.error}>Error loading events: {error}</p>}

        <div className={styles.eventGrid}>
          {events.map((event) => (
            <Link
              key={event.uid}
              href={`/events/${event.slug}`}
              className={styles.eventCard}
            >
              {event.banner_image?.url && (
                <img
                  {...(event.$?.banner_image ?? {})}
                  src={event.banner_image.url}
                  alt={event.title}
                  className={styles.eventImage}
                />
              )}
              <div className={styles.eventContent}>
                <h3 {...(event.$?.title ?? {})}>
                  {event.title}
                </h3>
                <p {...(event.$?.short_description ?? {})}>
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
