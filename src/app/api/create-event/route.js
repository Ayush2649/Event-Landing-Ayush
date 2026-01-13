import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
          title: body.title,
          slug: slug,
          location: body.location,
          event_date: body.event_date,
          description: body.description,
        },
        locale: "en-us",
      }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
