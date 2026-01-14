import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const title = body.title;
  const location = body.location;
  const event_date = body.event_date;
  const description = body.description;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Create entry
  const response = await fetch(
    "https://api.contentstack.io/v3/content_types/event_ayush/entries",
    {
      method: "POST",
      headers: {
        api_key: process.env.CONTENTSTACK_API_KEY,
        authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry: {
          title,
          slug,
          location,
          event_date,
          description,
        },
        locale: "en-us",
      }),
    }
  );

  const data = await response.json();
  console.log("Create Entry Response:", data);

  // Safety check
  if (!data.entry || !data.entry.uid) {
    return NextResponse.json(
      { error: "Entry creation failed", details: data },
      { status: 400 }
    );
  }

  // Publish entry
  await fetch(
    `https://api.contentstack.io/v3/content_types/event_ayush/entries/${data.entry.uid}/publish`,
    {
      method: "POST",
      headers: {
        api_key: process.env.CONTENTSTACK_API_KEY,
        authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publish_details: {
          environments: ["development"], // must match your env
          locale: "en-us",
        },
      }),
    }
  );

  return NextResponse.json({ success: true, entry: data.entry });
}
