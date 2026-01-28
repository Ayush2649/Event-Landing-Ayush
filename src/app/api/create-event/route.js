import { NextResponse } from "next/server";

async function uploadAsset(file) {
  const assetForm = new FormData();
  assetForm.append("asset[upload]", file);
  assetForm.append("asset[title]", file.name);

  const res = await fetch("https://api.contentstack.io/v3/assets", {
    method: "POST",
    headers: {
      api_key: process.env.CONTENTSTACK_API_KEY,
      authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    },
    body: assetForm,
  });

  const data = await res.json();
  return data?.asset?.uid || null;
}

async function createEntry(contentTypeUid, entry) {
  const res = await fetch(
    `https://api.contentstack.io/v3/content_types/${contentTypeUid}/entries`,
    {
      method: "POST",
      headers: {
        api_key: process.env.CONTENTSTACK_API_KEY,
        authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry,
        locale: "en-us",
      }),
    },
  );

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const message =
      data?.error_message ||
      data?.errors ||
      `Failed to create entry for ${contentTypeUid}`;
    const err = new Error(
      typeof message === "string" ? message : JSON.stringify(message),
    );
    err.details = data;
    throw err;
  }

  return data?.entry;
}

async function publishEntry(contentTypeUid, entryUid) {
  if (!entryUid) return;

  const url = `https://api.contentstack.io/v3/content_types/${contentTypeUid}/entries/${entryUid}/publish`;

  console.log("PUBLISHING:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      api_key: process.env.CONTENTSTACK_API_KEY,
      authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entry: {
        publish_details: {
          environments: ["development"],
          locales: ["en-us"],
        },
      },
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("PUBLISH RAW RESPONSE:", text);
    throw new Error(text);
  }
}

export async function POST(req) {
  try {
    // ✅ MUST be formData
    const formData = await req.formData();

    const title = formData.get("title");
    const location = formData.get("location");
    const start_time = formData.get("start_time");
    const end_time = formData.get("end_time");
    const category = formData.get("category");
    const description = formData.get("description");
    const cta_text = formData.get("cta_text");
    const cta_link = formData.get("cta_link");

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    /* ----------------------------
       Banner Image
    -----------------------------*/
    let bannerImageUid = null;
    const bannerImage = formData.get("banner_image");

    if (bannerImage && bannerImage.size > 0) {
      bannerImageUid = await uploadAsset(bannerImage);
    }

    /* ----------------------------
       Speakers
    -----------------------------*/
    const speakers = [];
    let i = 0;

    while (true) {
      const name = formData.get(`speaker_name_${i}`);
      if (!name || !name.trim()) break;

      const designation = formData.get(`speaker_designation_${i}`);
      const bio = formData.get(`speaker_bio_${i}`);
      const photo = formData.get(`speaker_photo_${i}`);

      let photoUid = null;
      if (photo && photo.size > 0) {
        photoUid = await uploadAsset(photo);
      }

      try {
        const speakerEntry = await createEntry("speaker_ayush", {
          title: name,
          designation,
          bio,
          photo: photoUid || undefined,
        });

        if (speakerEntry?.uid) {
          try {
            await publishEntry("speaker_ayush", speakerEntry.uid);
          } catch (pubErr) {
            console.error(
              `Speaker publish failed (uid: ${speakerEntry.uid}):`,
              pubErr?.message,
              pubErr?.details,
            );
          }

          speakers.push({
            uid: speakerEntry.uid,
            _content_type_uid: "speaker_ayush",
          });
        }
      } catch (e) {
        console.error("Speaker creation skipped:", e?.message, e?.details);
      }

      i++;
    }

    /* ----------------------------
       Schedule
    -----------------------------*/
    const schedule = [];
    let s = 0;

    while (true) {
      const time = formData.get(`schedule_time_${s}`);
      const schedTitle = formData.get(`schedule_title_${s}`);
      const schedDesc = formData.get(`schedule_description_${s}`);

      if (
        (!time || !time.trim()) &&
        (!schedTitle || !schedTitle.trim()) &&
        (!schedDesc || !schedDesc.trim())
      ) {
        break;
      }

      try {
        const scheduleEntry = await createEntry("schedule_ayush", {
          time: time || "",
          title: schedTitle || "",
          description: schedDesc || "",
        });

        if (scheduleEntry?.uid) {
          try {
            await publishEntry("schedule_ayush", scheduleEntry.uid);
          } catch (pubErr) {
            console.error(
              `Schedule publish failed (uid: ${scheduleEntry.uid}):`,
              pubErr?.message,
              pubErr?.details,
            );
          }

          schedule.push({
            uid: scheduleEntry.uid,
            _content_type_uid: "schedule_ayush",
          });
        }
      } catch (e) {
        console.error("Schedule creation skipped:", e?.message, e?.details);
      }

      s++;
    }

    /* ----------------------------
       Event Creation
    -----------------------------*/
    const entryPayload = {
      title,
      slug,
      location,
      start_time,
      end_time,
      description,
      cta_text: cta_text || "",
      cta_link: cta_link || "",
      category: category || "",
    };

    // For Asset fields, Contentstack expects the asset uid (or an array of uids),
    // NOT an object like { uid }.
    if (bannerImageUid) entryPayload.banner_image = bannerImageUid;
    if (speakers.length) entryPayload.speakers = speakers;
    if (schedule.length) entryPayload.schedule = schedule;

    const eventRes = await fetch(
      "https://api.contentstack.io/v3/content_types/event_ayush/entries",
      {
        method: "POST",
        headers: {
          api_key: process.env.CONTENTSTACK_API_KEY,
          authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entry: entryPayload, locale: "en-us" }),
      },
    );

    // 🔴 IMPORTANT: check status BEFORE assuming JSON structure
    let eventData = {};
    try {
      eventData = await eventRes.json();
    } catch {
      eventData = {};
    }

    if (!eventRes.ok || !eventData.entry) {
      console.error("Event creation failed:", eventData);

      return NextResponse.json(
        {
          success: false,
          message:
            eventData?.error_message || "Event creation failed in Contentstack",
          details: eventData,
        },
        { status: eventRes.status || 400 },
      );
    }

    // Auto-publish event as soon as it's created (best-effort)
    try {
      await publishEntry("event_ayush", eventData.entry.uid);
    } catch (pubErr) {
      console.error(`Auto-publish failed for event`, pubErr?.message);
    }

    return NextResponse.json(
      {
        success: true,
        event: eventData.entry,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err?.message || err);
    if (err?.details) {
      try {
        console.error(
          "CREATE EVENT ERROR DETAILS:",
          JSON.stringify(err.details, null, 2),
        );
      } catch {
        console.error("CREATE EVENT ERROR DETAILS:", err.details);
      }
    }
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        details: err.details || null,
      },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
