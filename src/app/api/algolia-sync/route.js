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

  const records = (data.entries || []).map((entry) => ({
    objectID: entry.uid,
    _content_type: "event_ayush",
    title: entry.title,
    slug: entry.slug,
    short_description: entry.short_description || "",
    start_time: entry.start_time,
    end_time: entry.end_time,
    banner_image: entry.banner_image ? { url: entry.banner_image.url } : null,
  }));

  await index.saveObjects(records);

  return Response.json({
    success: true,
    indexed: records.length,
  });
}
