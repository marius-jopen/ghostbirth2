import { emph } from "@/lib/emph";
import ProtectedScript from "./ProtectedScript";

type DLItem = { type: string; name: string; detail: string; file: string | null };
type ScriptCard = { type: string; name: string; detail: string; file: string | null };

type DownloadsContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  items: readonly DLItem[];
  scriptCard: ScriptCard;
};

export default function Downloads({ downloads }: { downloads: DownloadsContent }) {
  return (
    <section className="downloads" id="downloads">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{downloads.sectionLabelNum}</span>
          <span>{downloads.sectionLabel}</span>
          <span className="bar" />
        </div>
        <h2 className="big">{emph(downloads.title)}</h2>
        <div className="dl-grid">
          {downloads.items.map((d, i) => {
            const disabled = !d.file;
            const Tag: "a" | "span" = disabled ? "span" : "a";
            return (
              <Tag
                key={i}
                href={disabled ? undefined : d.file ?? undefined}
                download={disabled ? undefined : ""}
                className={`dl ${disabled ? "disabled" : ""}`}
              >
                <span className="icon">↓</span>
                <div className="type">{d.type}</div>
                <div className="name">{d.name}</div>
                <div className="detail">{d.detail}</div>
              </Tag>
            );
          })}
          <ProtectedScript sc={downloads.scriptCard} />
        </div>
      </div>
    </section>
  );
}
