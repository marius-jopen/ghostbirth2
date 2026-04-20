type AboutContent = {
  title: string;
  paragraphs: readonly string[];
};

export default function About({ about }: { about: AboutContent }) {
  return (
    <section id="about" className="section">
      <h2 className="section-title">{about.title}</h2>
      <div className="section-text-wrap">
        {about.paragraphs.map((p, i) => (
          <p key={i} className="section-text">{p}</p>
        ))}
      </div>
    </section>
  );
}
