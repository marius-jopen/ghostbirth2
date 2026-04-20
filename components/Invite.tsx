import Link from "next/link";
import { emph } from "@/lib/emph";

type InviteContent = {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function Invite({ invite }: { invite: InviteContent }) {
  return (
    <section className="invite">
      <div className="wrap">
        <h3>{emph(invite.title)}</h3>
        <p>{invite.body}</p>
        <div className="cta-row">
          <Link href={invite.ctaHref} className="cta primary">
            {invite.ctaLabel} <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
