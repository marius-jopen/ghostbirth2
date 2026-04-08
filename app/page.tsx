import fs from "fs";
import path from "path";
import Hero from "@/components/Hero";
import Logline from "@/components/Logline";
import About from "@/components/About";
import Story from "@/components/Story";
import VideoBreak from "@/components/VideoBreak";
import Director from "@/components/Director";
import Gallery from "@/components/Gallery";
import Status from "@/components/Status";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import LangSwitcher from "@/components/LangSwitcher";
import BloodSmear from "@/components/BloodSmear";
import Testimonials from "@/components/Testimonials";

function getBtsImages(): string[] {
  const dir = path.join(process.cwd(), "public", "bts");
  const files = fs.readdirSync(dir);
  return files
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();
}

export default function Home() {
  const btsImages = getBtsImages();

  return (
    <>
      <Nav />
      <LangSwitcher />
      <div id="site-content">
        <BloodSmear />
        <Hero />
        <Logline />
        <About />
        <VideoBreak src="https://vz-39ea9c43-53e.b-cdn.net/08ad4c9c-2388-4b7d-9b91-2dbd60ef21f3/playlist.m3u8" />
        <Story />
        <VideoBreak src="https://vz-39ea9c43-53e.b-cdn.net/0c3afd0d-893b-475b-83a8-f839ce86af70/playlist.m3u8" />
        <Director />
        <VideoBreak src="https://vz-39ea9c43-53e.b-cdn.net/08ad4c9c-2388-4b7d-9b91-2dbd60ef21f3/playlist.m3u8" />
        <Gallery images={btsImages} />
        <Testimonials />
        {/* <Status /> */}
        <Footer />
      </div>
    </>
  );
}
