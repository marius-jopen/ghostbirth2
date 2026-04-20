import ProdHero from "@/components/ProdHero";
import Synopsis from "@/components/Synopsis";
import Status from "@/components/Status";
import Timeline from "@/components/Timeline";
import Visual from "@/components/Visual";
import Downloads from "@/components/Downloads";
import VideoBreak from "@/components/VideoBreak";
import { getPitch } from "@/lib/content";

export default async function PitchPage() {
  const pitch = await getPitch();
  return (
    <>
      <ProdHero hero={pitch.hero} />
      <VideoBreak video={pitch.hero.videoAfter} />
      <Synopsis synopsis={pitch.synopsis} />
      <VideoBreak video={pitch.synopsis.videoAfter} />
      <Status status={pitch.status} />
      <VideoBreak video={pitch.status.videoAfter} />
      <Timeline timeline={pitch.timeline} />
      <VideoBreak video={pitch.timeline.videoAfter} />
      <Visual visual={pitch.visual} />
      <VideoBreak video={pitch.visual.videoAfter} />
      <Downloads downloads={pitch.downloads} />
      <VideoBreak video={pitch.downloads.videoAfter} />
    </>
  );
}
