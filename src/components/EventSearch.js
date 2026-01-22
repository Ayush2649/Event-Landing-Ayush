// "use client";

// import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
// import { searchClient } from "../app/lib/algolia";
// import CountdownTimer from "./Header/CountDownTimer";
// import { getEventStatus } from "../utils/eventStatus";
// import { Configure } from "react-instantsearch";
// import { useEffect, useState } from "react";
// import styles from "./EventSearch.module.css";

// function EventCard({ hit }) {
//   const status = getEventStatus(hit.start_time, hit.end_time);

//   return (
//     <a href={`/events/${hit.slug}`} className={styles.eventCard}>
//       {hit.banner_image?.url && (
//         <img
//           src={hit.banner_image.url}
//           alt={hit.title}
//           className={styles.eventImage}
//         />
//       )}
//       <div className={styles.eventContent}>
//         <h3>{hit.title}</h3>
//         <span className={`${styles.badge} ${styles[status]}`}>
//           {status === "upcoming" && "Upcoming"}
//           {status === "live" && "Live"}
//           {status === "ended" && "Ended"}
//         </span>

//         {status === "upcoming" && <CountdownTimer eventDate={hit.start_time} />}

//         {status === "live" && <p className={styles.liveText}>🔴 Live Now</p>}

//         {status === "ended" && <p className={styles.endedText}>Event Ended</p>}
//         <p>
//           {hit.short_description ||
//             "A professionally managed event powered by Contentstack."}
//         </p>
//       </div>
//     </a>
//   );
// }

// export default function EventSearch() {
//   const [interest, setInterestState] = useState(null);

//   useEffect(() => {
//     const storedInterest = localStorage.getItem("user_interest");
//     setInterestState(storedInterest);
//   }, []);

//   function handleSetInterest(value) {
//     localStorage.setItem("user_interest", value);
//     setInterestState(value);
//   }

//   return (
//     <>
//       <div className={styles.interestBar}>
//         <button onClick={() => handleSetInterest("tech")}>Tech</button>
//         <button onClick={() => handleSetInterest("music")}>Music</button>
//         <button onClick={() => handleSetInterest("sports")}>Sports</button>
//       </div>
//       {interest && (
//         <>
//           <h2>Recommended for you</h2>

//           <InstantSearch searchClient={searchClient} indexName="events">
//             <Configure
//               key={interest}
//               filters={`_content_type:"event_ayush" AND category:"${interest}"`}
//               hitsPerPage={3}
//             />

//             <div className={styles.eventGrid}>
//               <Hits hitComponent={EventCard} />
//             </div>
//           </InstantSearch>
//         </>
//       )}
//       <InstantSearch searchClient={searchClient} indexName="events">
//         <Configure filters='_content_type:"event_ayush"' />

//         <div className={styles.searchCard}>
//           <SearchBox placeholder="Search events..." />

//           <div className={styles.eventGrid}>
//             <Hits hitComponent={EventCard} />
//           </div>
//         </div>
//       </InstantSearch>
//     </>
//   );
// }

"use client";

import { InstantSearch, SearchBox, Hits, Configure } from "react-instantsearch";
import { searchClient } from "../app/lib/algolia";
import CountdownTimer from "./Header/CountDownTimer";
import { getEventStatus } from "../utils/eventStatus";
import styles from "./EventSearch.module.css";
import { useEffect, useState } from "react";

function EventCard({ hit }) {
  const status = getEventStatus(hit.start_time, hit.end_time);

  return (
    <a href={`/events/${hit.slug}`} className={styles.eventCard}>
      {hit.banner_image?.url && (
        <img
          src={hit.banner_image.url}
          alt={hit.title}
          className={styles.eventImage}
        />
      )}
      <div className={styles.eventContent}>
        <h3>{hit.title}</h3>

        <span className={`${styles.badge} ${styles[status]}`}>
          {status}
        </span>

        {status === "upcoming" && <CountdownTimer eventDate={hit.start_time} />}
        {status === "live" && <p>🔴 Live Now</p>}
        {status === "ended" && <p>Event Ended</p>}
      </div>
    </a>
  );
}

export default function EventSearch() {
  const [interest, setInterest] = useState(null);

  useEffect(() => {
    setInterest(localStorage.getItem("user_interest"));
  }, []);

  const handleInterest = (value) => {
    localStorage.setItem("user_interest", value);
    setInterest(value);
  };

  return (
    <>
      {/* 🔥 CATEGORY BUTTONS */}
      <div className={styles.filterBar}>
        {["tech", "music", "sports", "festivals"].map((cat) => (
          <button
            key={cat}
            onClick={() => handleInterest(cat)}
            className={`${styles.filterBtn} ${
              interest === cat ? styles.active : ""
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => handleInterest(null)}
          className={styles.filterBtn}
        >
          All
        </button>
      </div>

      <InstantSearch searchClient={searchClient} indexName="events">
        <Configure filters='_content_type:"event_ayush"' />

        {/* 🔥 Recommended */}
        {interest && (
          <>
            <h2 className={styles.sectionTitle}>Recommended for you</h2>
            <div className={styles.eventGrid}>
              <Configure
                filters={`_content_type:"event_ayush" AND category:"${interest}"`}
                hitsPerPage={3}
              />
              <Hits hitComponent={EventCard} />
            </div>
          </>
        )}

        {/* 🔥 All Events */}
        {/* <h2 className={styles.sectionTitle}>All Events</h2> */}

        <div className={styles.searchBarWrapper}>
          <SearchBox placeholder="Search events..." />
        </div>

        <div className={styles.eventGrid}>
          <Hits hitComponent={EventCard} />
        </div>
      </InstantSearch>
    </>
  );
}
