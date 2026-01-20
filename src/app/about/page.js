import styles from "./page.module.css";

export default function AboutUs() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <h1>About Eventify</h1>
        <h4>
          Eventify is a modern event management platform built to simplify how
          events are created, managed, and launched.
        </h4>
      </section>

      {/* CONTENT */}
      <section className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.icon}>🚀</span>
          <h3>Who We Are</h3>
          <p>
            Eventify helps teams focus on delivering great experiences instead
            of worrying about operational complexity.
          </p>
        </div>

        <div className={styles.card}>
          <span className={styles.icon}>🎯</span>
          <h3>Our Mission</h3>
          <p>
            To make event creation fast, structured, and automated using modern
            content and frontend technologies.
          </p>
        </div>

        <div className={styles.card}>
          <span className={styles.icon}>⚙️</span>
          <h3>What We Do</h3>
          <p>
            We combine Contentstack, automation, and Next.js to deliver clean,
            scalable, and high-performance event pages.
          </p>
        </div>

        <div className={styles.card}>
          <span className={styles.icon}>🌱</span>
          <h3>Our Vision</h3>
          <p>
            A future where launching professional events is as simple as filling
            out a form.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Build smarter events with Eventify</h2>
        <h4>Create, automate, and launch events effortlessly.</h4>
        <a href="/create-event" className={styles.ctaBtn}>
          Create Your First Event
        </a>
      </section>
      <footer className={styles.footer}>
        © 2026 Eventify · Powered by Contentstack · Built with Next.js
      </footer>
    </main>
  );
}
