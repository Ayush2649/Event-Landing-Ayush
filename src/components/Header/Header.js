"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      {/* LOGO */}
      <Link href="/" className={styles.logo}>
        <img src="/logo2.png" alt="Eventify Logo" />
      </Link>

      <button
        className={styles.menuToggle}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* NAV LINKS */}
      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
        <Link href="/about" onClick={closeMenu}>About Us</Link>
        <Link href="/events" onClick={closeMenu}>Events</Link>
        <Link href="/create-event" onClick={closeMenu}>Create Event</Link>
        {isLoggedIn ? (
          <UserDropdown />
        ) : (
          <button className={styles.loginBtn} onClick={() => { handleLogin(); closeMenu(); }}>
            Login
          </button>
        )}
      </nav>
    </header>
  );
}