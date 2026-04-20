import { config, fields, singleton } from "@keystatic/core";

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Ghostbirth 2" },
  },
  singletons: {
    hero: singleton({
      label: "Hero",
      path: "content/keystatic/hero/",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        subtitle: fields.text({ label: "Subtitle" }),
        status: fields.text({ label: "Status line" }),
        posterImage: fields.image({
          label: "Poster background",
          directory: "public/cms/hero",
          publicPath: "/cms/hero/",
        }),
      },
    }),

    logline: singleton({
      label: "Logline",
      path: "content/keystatic/logline/",
      format: { data: "yaml" },
      schema: {
        text: fields.text({ label: "Logline", multiline: true }),
      },
    }),

    about: singleton({
      label: "About",
      path: "content/keystatic/about/",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        paragraphs: fields.array(
          fields.text({ label: "Paragraph", multiline: true }),
          { label: "Paragraphs", itemLabel: (p) => p.value.slice(0, 60) }
        ),
      },
    }),

    story: singleton({
      label: "Story",
      path: "content/keystatic/story/",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        paragraphs: fields.array(
          fields.text({ label: "Paragraph", multiline: true }),
          { label: "Paragraphs", itemLabel: (p) => p.value.slice(0, 60) }
        ),
      },
    }),

    director: singleton({
      label: "Director",
      path: "content/keystatic/director/",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        text: fields.text({ label: "Text", multiline: true }),
      },
    }),

    gallery: singleton({
      label: "Gallery",
      path: "content/keystatic/gallery/",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        description: fields.text({ label: "Description", multiline: true }),
        loadMore: fields.text({ label: "Load more label" }),
        images: fields.array(
          fields.image({
            label: "Image",
            directory: "public/cms/gallery",
            publicPath: "/cms/gallery/",
          }),
          { label: "Images", itemLabel: (i) => i.value?.filename ?? "image" }
        ),
      },
    }),

    testimonials: singleton({
      label: "Testimonials",
      path: "content/keystatic/testimonials/",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        items: fields.array(
          fields.object({
            quote: fields.text({ label: "Quote", multiline: true }),
            author: fields.text({ label: "Author" }),
          }),
          { label: "Items", itemLabel: (i) => i.fields.author.value }
        ),
      },
    }),

    footer: singleton({
      label: "Footer",
      path: "content/keystatic/footer/",
      format: { data: "yaml" },
      schema: {
        title: fields.text({ label: "Title" }),
        email: fields.text({ label: "Contact email" }),
        instagramUrl: fields.url({ label: "Instagram URL" }),
        substackEmbedUrl: fields.url({ label: "Substack embed URL" }),
        credit: fields.text({ label: "Credit line" }),
        copyright: fields.text({ label: "Copyright" }),
      },
    }),

    nav: singleton({
      label: "Nav",
      path: "content/keystatic/nav/",
      format: { data: "yaml" },
      schema: {
        about: fields.text({ label: "About label" }),
        story: fields.text({ label: "Story label" }),
        director: fields.text({ label: "Director label" }),
        gallery: fields.text({ label: "Gallery label" }),
        contact: fields.text({ label: "Contact label" }),
      },
    }),

    videos: singleton({
      label: "Video breaks",
      path: "content/keystatic/videos/",
      format: { data: "yaml" },
      schema: {
        videoOne: fields.url({ label: "Video 1 (HLS .m3u8)" }),
        videoTwo: fields.url({ label: "Video 2 (HLS .m3u8)" }),
        videoThree: fields.url({ label: "Video 3 (HLS .m3u8)" }),
      },
    }),
  },
});
