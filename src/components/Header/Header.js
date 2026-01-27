"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  return (
    <header className={styles.header}>
      {/* LOGO */}
      <Link href="/" className={styles.logo}>
        <img src="/logo2.png" alt="Eventify Logo" />
      </Link>

      {/* NAV LINKS */}
      <nav className={styles.nav}>
        <Link href="/about">About Us</Link>
        <Link href="/events">Events</Link>
        <Link href="/create-event">Create Event</Link>
        
        {isLoggedIn ? (
          <UserDropdown />
        ) : (
          <button className={styles.loginBtn} onClick={handleLogin}>
            Login
          </button>
        )}
      </nav>
    </header>
  );
}
