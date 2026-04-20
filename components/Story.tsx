type StoryContent = {
  title: string;
  paragraphs: readonly string[];
};

export default function Story({ story }: { story: StoryContent }) {
  return (
    <section id="story" className="section">
      <h2 className="section-title">{story.title}</h2>
      <div className="section-text-wrap">
        {story.paragraphs.map((p, i) => (
          <p key={i} className="section-text">{p}</p>
        ))}
      </div>
    </section>
  );
}
