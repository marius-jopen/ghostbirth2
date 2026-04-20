import "server-only";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

export async function getContent() {
  const [hero, logline, about, story, director, gallery, testimonials, footer, nav, videos] =
    await Promise.all([
      reader.singletons.hero.read(),
      reader.singletons.logline.read(),
      reader.singletons.about.read(),
      reader.singletons.story.read(),
      reader.singletons.director.read(),
      reader.singletons.gallery.read(),
      reader.singletons.testimonials.read(),
      reader.singletons.footer.read(),
      reader.singletons.nav.read(),
      reader.singletons.videos.read(),
    ]);

  if (!hero || !logline || !about || !story || !director || !gallery || !testimonials || !footer || !nav || !videos) {
    throw new Error("Missing Keystatic content. Visit /keystatic to create it.");
  }

  return { hero, logline, about, story, director, gallery, testimonials, footer, nav, videos };
}

export type SiteContent = Awaited<ReturnType<typeof getContent>>;
