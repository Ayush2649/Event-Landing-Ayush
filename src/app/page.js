import Stack from "./lib/contentstack";

export default async function HomePage() {
  const Query = Stack.ContentType("event_ayush").Query();

  Query.where("slug", "contentstack-event-ayush");
  Query.includeReference(["speakers", "schedule"]);
  Query.toJSON();

  const result = await Query.find();
  const event = result[0][0];

  // console.log(event.landing_sections);

  return (
    <main style={{ padding: "2rem" }}>
      {/* Event Details */}
      <h1>{event.title}</h1>
      <img
        src={event.banner_image.url}
        alt={event.title}
        style={{ width: "100%" }}
      />
      <p>Event Location: {event.location}</p>
      <p>Event will be on {event.event_date}</p>

      {/* Speaker Details */}
      <section>
        <h2>Speakers</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          {event.speakers.map((speaker) => (
            <div key={speaker.uid} style={{ textAlign: "center" }}>
              <img
                src={speaker.photo.url}
                alt={speaker.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <h3>{speaker.name}</h3>
              <p>{speaker.designation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule Details */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Schedule</h2>

        {event.schedule.map((item) => (
          <div key={item.uid} style={{ marginBottom: "1rem" }}>
            <strong>{item.time}</strong>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      {/* Landing Page Section */}
      <section style={{ marginTop: "3rem" }}>
        {event.landing_sections.map((block, index) => {
          if (block.hero_section) {
            return (
              <section
                key={index}
                style={{
                  backgroundImage: `url(${block.hero_section.background_image.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "70vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <h1 style={{ fontSize: "3rem" }}>
                  {block.hero_section.heading}
                </h1>
                <p style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
                  {block.hero_section.subheading}
                </p>
              </section>
            );
          }

          if (block.text_section) {
            return (
              <section key={index} style={{ marginBottom: "2rem" }}>
                <h2>{block.text_section.title}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: block.text_section.content,
                  }}
                />
              </section>
            );
          }

          if (block.cta_section) {
            return (
              <section
                key={index}
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  background: "#f5f5f5",
                }}
              >
                <a href={block.cta_section.cta_link}>
                  <button
                    style={{
                      padding: "1rem 2rem",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    {block.cta_section.cta_text}
                  </button>
                </a>
              </section>
            );
          }

          return null;
        })}
      </section>
    </main>
  );
}
