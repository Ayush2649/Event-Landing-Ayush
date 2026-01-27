"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./UserDropdown.module.css";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Mock stats - you can replace with real data
  const userStats = {
    name: "John Doe",
    eventsCreated: 12,
    upcomingEvents: 3,
    pastEvents: 9,
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <div className={styles.userDropdown} ref={dropdownRef}>
      <button
        className={styles.userIcon}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <img
                src="https://ui-avatars.com/api/?name=John+Doe&background=00bfff&color=fff&size=80"
                alt={userStats.name}
              />
            </div>
            <h3>{userStats.name}</h3>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userStats.eventsCreated}</span>
              <span className={styles.statLabel}>Total Events</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userStats.upcomingEvents}</span>
              <span className={styles.statLabel}>Upcoming</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{userStats.pastEvents}</span>
              <span className={styles.statLabel}>Past</span>
            </div>
          </div>

          <div className={styles.actions}>
            <a href="/events" className={styles.actionLink}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              My Events
            </a>
            <a href="/create-event" className={styles.actionLink}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </a>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
