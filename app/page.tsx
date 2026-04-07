import Hero from "@/components/Hero";
import Logline from "@/components/Logline";
import About from "@/components/About";
import Story from "@/components/Story";
import VideoBreak from "@/components/VideoBreak";
import VideoBreak2 from "@/components/VideoBreak2";
import Director from "@/components/Director";
import Gallery from "@/components/Gallery";
import Status from "@/components/Status";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Logline />
      <About />
      <VideoBreak2 />
      <Story />
      <VideoBreak />
      <Director />
      <Gallery />
      {/* <Status /> */}
      <Footer />
    </>
  );
}
