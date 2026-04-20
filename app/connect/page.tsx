import Connect from "@/components/Connect";
import VideoBreak from "@/components/VideoBreak";
import { getConnect, getSite } from "@/lib/content";

export default async function ConnectPage() {
  const [connect, site] = await Promise.all([getConnect(), getSite()]);

  return (
    <>
      <div className="connect-video-head">
        <VideoBreak video={connect.topVideo} />
      </div>
      <div className="connect-page">
        <Connect body={connect} contact={site.contact} />
      </div>
    </>
  );
}
