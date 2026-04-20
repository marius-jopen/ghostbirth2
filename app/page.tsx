import Hero from "@/components/Hero";
import About from "@/components/About";
import Statement from "@/components/Statement";
import Gallery from "@/components/Gallery";
import Director from "@/components/Director";
import Invite from "@/components/Invite";
import VideoBreak from "@/components/VideoBreak";
import { getHome } from "@/lib/content";

export default async function Home() {
  const home = await getHome();
  const images = home.gallery.images.filter(
    (s): s is string => typeof s === "string" && s.length > 0
  );

  return (
    <>
      <Hero hero={home.hero} />
      <About about={home.about} />
      <VideoBreak video={home.about.videoAfter} />
      <Statement statement={home.statement} />
      <VideoBreak video={home.statement.videoAfter} />
      <Gallery gallery={{ ...home.gallery, images }} />
      <Director director={home.director} />
      <VideoBreak video={home.director.videoAfter} />
      <Invite invite={home.invite} />
    </>
  );
}
