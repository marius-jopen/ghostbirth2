type DirectorContent = {
  title: string;
  text: string;
};

export default function Director({ director }: { director: DirectorContent }) {
  return (
    <section id="director" className="section">
      <h2 className="section-title">{director.title}</h2>
      <div className="section-text-wrap section-text">{director.text}</div>
    </section>
  );
}
