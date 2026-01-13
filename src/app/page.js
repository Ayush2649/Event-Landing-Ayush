import Stack from "./lib/contentstack";

export default async function HomePage() {
  const Query = Stack.ContentType("event_ayush").Query();

  Query.where("slug", "vcet-zeal");
  Query.includeReference(["speakers", "schedule"]);
  Query.toJSON();

  const result = await Query.find();
  const event = result[0][0];

  return (
    <main style={{ padding: "2rem" }}>
      {/* Event Details */}
      <h1>{event.title}</h1>

      {event.banner_image && (
        <img
          src={event.banner_image.url}
          alt={event.title}
          style={{ width: "100%" }}
        />
      )}

      <p>Event Location: {event.location}</p>
      <p>Event will be on {event.event_date}</p>

      {/* Speakers */}
      <section>
        <div className="container">
          <h2>Speakers</h2>

          <div className="speakers-grid">
            {event.speakers.map((speaker) => (
              <div key={speaker.uid}>
                <img
                  src={
                    speaker.photo?.url ||
                    `https://i.pravatar.cc/150?u=${speaker.uid}`
                  }
                  alt={speaker.name}
                  className="speaker-img"
                />
                <h3>{speaker.name}</h3>
                <p>{speaker.designation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section>
        <div className="container">
          <h2>Schedule</h2>

          {event.schedule.map((item) => (
            <div key={item.uid} className="schedule-item">
              <strong>{item.time}</strong>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modular Blocks */}
      {event.landing_sections.map((block, index) => {
        if (block.hero_section) {
          console.log(block.hero_section.background_image);
          return (
            <section
              key={index}
              className="hero"
              style={{
                backgroundImage: `url(${block.hero_section.background_image.url})`,
              }}
            >
              <div className="hero-content">
                <h1>{block.hero_section.heading}</h1>
                <p>{block.hero_section.sub_heading}</p>
              </div>
            </section>
          );
        }

        if (block.text_section) {
          return (
            <section key={index}>
              <div className="container">
                <h2>{block.text_section.title}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: block.text_section.content,
                  }}
                />
              </div>
            </section>
          );
        }

        if (block.cta_section) {
          return (
            <section key={index} className="cta">
              <div className="container">
                <h2>{block.cta_section.cta_text}</h2>
                <a href={block.cta_section.cta_link}>
                  <button>Register Now</button>
                </a>
              </div>
            </section>
          );
        }

        return null;
      })}
    </main>
  );
}