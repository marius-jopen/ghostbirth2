import Hero from "@/components/Hero";
import Logline from "@/components/Logline";
import About from "@/components/About";
import Story from "@/components/Story";
import VideoBreak from "@/components/VideoBreak";
import Director from "@/components/Director";
import Gallery from "@/components/Gallery";
import Status from "@/components/Status";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Hero />
      <ScrollReveal>
        <Logline />
      </ScrollReveal>
      <ScrollReveal>
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
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </>
  );
}
