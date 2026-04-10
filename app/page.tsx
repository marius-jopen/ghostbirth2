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
  const files = fs.readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  // Shuffle for random order on each page load
  for (let i = files.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [files[i], files[j]] = [files[j], files[i]];
  }

  return files;
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
        <VideoBreak src="https://vz-39ea9c43-53e.b-cdn.net/63ff639a-575c-4bea-9eec-870fc25e7de7/playlist.m3u8" />
        <Gallery images={btsImages} />
        <Testimonials />
        {/* <Status /> */}
        <Footer />
      </div>
    </>
  );
}
