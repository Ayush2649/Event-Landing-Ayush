export function getEventStatus(start, end) {
  const now = new Date();
  const startTime = new Date(start);
  const endTime = new Date(end);

  if (now < startTime) return "upcoming";
  if (now >= startTime && now <= endTime) return "live";
  return "ended";
}
