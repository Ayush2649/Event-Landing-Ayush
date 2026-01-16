import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  /* ----------------------------
     1️⃣ Create Speaker entry
  -----------------------------*/
  let speakerUid = null;

  if (body.speaker_name) {
    const speakerRes = await fetch(
      "https://api.contentstack.io/v3/content_types/speaker_ayush/entries",
      {
        method: "POST",
        headers: {
          api_key: process.env.CONTENTSTACK_API_KEY,
          authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: {
            title: body.speaker_name,
            bio: body.speaker_bio,
            designation: body.speaker_designation,
          },
          locale: "en-us",
        }),
      }
    );

    const speakerData = await speakerRes.json();
    if (speakerData?.entry?.uid) {
      speakerUid = speakerData.entry.uid;
    }
  }

  /* ----------------------------
     2️⃣ Create Schedule entry
  -----------------------------*/
  let scheduleUid = null;

  if (body.schedule_title) {
    const scheduleRes = await fetch(
      "https://api.contentstack.io/v3/content_types/schedule_ayush/entries",
      {
        method: "POST",
        headers: {
          api_key: process.env.CONTENTSTACK_API_KEY,
          authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry: {
            time: body.schedule_time,
            title: body.schedule_title,
          },
          locale: "en-us",
        }),
      }
    );

    const scheduleData = await scheduleRes.json();
    if (scheduleData?.entry?.uid) {
      scheduleUid = scheduleData.entry.uid;
    }
  }

  const landingSections = [];

  if (body.cta_text && body.cta_link) {
    landingSections.push({
      cta_section: {
        cta_text: body.cta_text,
        cta_link: body.cta_link,
      },
    });
  }

  /* ----------------------------
     3️⃣ Create Event entry
  -----------------------------*/
  const eventRes = await fetch(
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
          slug,
          location: body.location,
          event_date: body.event_date,
          description: body.description,
          speakers: speakerUid ? [{ uid: speakerUid }] : [],
          schedule: scheduleUid ? [{ uid: scheduleUid }] : [],
          landing_sections: landingSections,
        },
        locale: "en-us",
      }),
    }
  );

  const eventData = await eventRes.json();

  if (!eventData.entry) {
    return NextResponse.json(
      { error: "Event creation failed", details: eventData },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    event: eventData.entry,
  });
}
