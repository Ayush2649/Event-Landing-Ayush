export function sortEventsByTime(events) {
  const now = new Date();

  const upcomingOrLive = [];
  const ended = [];

  events.forEach((event) => {
    const end = new Date(event.end_time);
    if (end < now) {
      ended.push(event);
    } else {
      upcomingOrLive.push(event);
    }
  });

  // 🔹 Upcoming & live: nearest start_time first
  upcomingOrLive.sort(
    (a, b) =>
      new Date(a.start_time).getTime() -
      new Date(b.start_time).getTime()
  );

  // 🔹 Ended: most recently ended first
  ended.sort(
    (a, b) =>
      new Date(b.end_time).getTime() -
      new Date(a.end_time).getTime()
  );

  return [...upcomingOrLive, ...ended];
}
