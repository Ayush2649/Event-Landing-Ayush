// "use client";

// import { useEffect, useState } from "react";
// import Stack from "@/lib/contentstack";
// import ContentstackLivePreview from "@contentstack/live-preview-utils";

// export default function EventPreviewClient({ slug }) {
//   const [event, setEvent] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const Query = Stack.ContentType("event_ayush").Query();
//       Query.where("slug", slug);
//       Query.includeReference(["speakers", "schedule"]);
//       Query.toJSON();

//       const result = await Query.find();
//       setEvent(result?.[0]?.[0] || null);
//     };

//     fetchData();

//     // 🔥 IMPORTANT: re-fetch when Live Preview updates
//     ContentstackLivePreview.onEntryChange(fetchData);
//   }, [slug]);

//   if (!event) return <p>Loading preview…</p>;

//   return (
//     <>
//       <h1>{event.title}</h1>
//       <p>{event.location}</p>
//     </>
//   );
// }
