import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      {/* LOGO */}
      <Link href="/" className={styles.logo}>
        🎤 Eventify
      </Link>

      {/* NAV LINKS */}
      <nav className={styles.nav}>
        <Link href="/about">About Us</Link>
        <Link href="/events">Events</Link>
        <Link href="/create-event">Create Event</Link>
        <Link href="/login" className={styles.loginBtn}>
          Login
        </Link>
      </nav>
    </header>
  );
}
