import Hero from "@/components/Hero";
import Logline from "@/components/Logline";
import About from "@/components/About";
import Story from "@/components/Story";
import VideoBreak from "@/components/VideoBreak";
import Director from "@/components/Director";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import BloodSmear from "@/components/BloodSmear";
import Testimonials from "@/components/Testimonials";
import { getContent } from "@/lib/content";

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function Home() {
  const c = await getContent();
  const galleryImages = shuffle(c.gallery.images).filter(
    (src): src is string => typeof src === "string" && src.length > 0
  );

  return (
    <>
      <Nav nav={c.nav} />
      <div id="site-content">
        <BloodSmear />
        <Hero hero={c.hero} />
        <Logline text={c.logline.text} />
        <About about={c.about} />
        <VideoBreak src={c.videos.videoOne ?? ""} />
        <Story story={c.story} />
        <VideoBreak src={c.videos.videoTwo ?? ""} />
        <Director director={c.director} />
        <VideoBreak src={c.videos.videoThree ?? ""} />
        <Gallery images={galleryImages} gallery={c.gallery} />
        <Testimonials testimonials={c.testimonials} />
        <Footer footer={c.footer} />
      </div>
    </>
  );
}
