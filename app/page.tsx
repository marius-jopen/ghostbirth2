import Hero from "@/components/Hero";
import About from "@/components/About";
import Statement from "@/components/Statement";
import Gallery from "@/components/Gallery";
import Director from "@/components/Director";
import Foundation from "@/components/Foundation";
import Invite from "@/components/Invite";
import Connect from "@/components/Connect";
import VideoBreak from "@/components/VideoBreak";
import { getHome, getConnect, getSite } from "@/lib/content";

export default async function Home() {
  const [home, connect, site] = await Promise.all([
    getHome(),
    getConnect(),
    getSite(),
  ]);
  const images = home.gallery.images.filter(
    (s): s is string => typeof s === "string" && s.length > 0
  );

  return (
    <>
      <Hero hero={home.hero} />
      <VideoBreak video={home.hero.introVideo} fullscreen />
      <About about={home.about} />
      <VideoBreak video={home.about.videoAfter} />
      <Statement statement={home.statement} />
      <VideoBreak video={home.statement.videoAfter} />
      <Gallery gallery={{ ...home.gallery, images }} />
      <Director director={home.director} />
      <VideoBreak video={home.director.videoAfter} />
      <Foundation foundation={home.foundation} />
      <VideoBreak video={home.foundation.video} fullscreen />
      <Invite invite={home.invite} />
      <VideoBreak video={connect.topVideo} />
      <Connect body={connect} contact={site.contact} />
    </>
  );
}
