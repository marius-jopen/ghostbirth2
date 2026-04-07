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
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Nav />
      <LangSwitcher />
      <div id="site-content">
        <BloodSmear />
        <Hero />
        <ScrollReveal auto delay={1.5}>
          <Logline />
        </ScrollReveal>
        <ScrollReveal auto delay={2.5}>
          <About />
        </ScrollReveal>
        <VideoBreak src="/video-2.mp4" />
        <ScrollReveal>
          <Story />
        </ScrollReveal>
        <VideoBreak src="/video-1.mov" />
        <ScrollReveal>
          <Director />
        </ScrollReveal>
        <Gallery />
        {/* <Status /> */}
        <Footer />
      </div>
    </>
  );
}
