import algoliasearch from "algoliasearch";

export async function POST() {
  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY,
  );

  const index = client.initIndex("events");

  const res = await fetch(
    `https://cdn.contentstack.io/v3/content_types/event_ayush/entries`,
    {
      headers: {
        api_key: process.env.CONTENTSTACK_API_KEY,
        access_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
      },
    },
  );

  const data = await res.json();

  const records = (data.entries || []).map((event) => ({
    objectID: event.uid,
    title: event.title,
    location: event.location,
    slug: event.slug,
    start_time: event.start_time,
    end_time: event.end_time,

    // ✅ ADD THIS
    banner_image: event.banner_image
      ? {
          url: event.banner_image.url,
        }
      : null,

    short_description: event.short_description || "",
  }));

  await index.saveObjects(records);

  return Response.json({
    success: true,
    indexed: records.length,
  });
}
