import { config, fields, singleton } from "@keystatic/core";

const paragraphs = (label: string) =>
  fields.array(fields.text({ label: "Paragraph", multiline: true }), {
    label,
    itemLabel: (p) => p.value.slice(0, 60),
  });

const image = (directory: string, publicPath: string) =>
  fields.image({ label: "Image", directory, publicPath });

const imageArray = (label: string, directory: string, publicPath: string) =>
  fields.array(image(directory, publicPath), {
    label,
    itemLabel: (i) => i.value?.filename ?? "image",
  });

const labelValueRow = (label: string) =>
  fields.array(
    fields.object({
      label: fields.text({ label: "Label" }),
      value: fields.text({ label: "Value", multiline: true }),
    }),
    { label, itemLabel: (r) => r.fields.label.value }
  );

const videoAfter = () =>
  fields.object(
    {
      src: fields.url({
        label: "Video URL (HLS .m3u8 or .mp4, leave empty for red placeholder)",
      }),
      label: fields.text({ label: "Label (e.g. BTS · BKK · 01)" }),
    },
    { label: "— Video after this section" }
  );

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Ghostbirth 2" },
    navigation: {
      Pages: ["home", "pitch", "connect"],
      Site: ["site"],
    },
  },
  singletons: {
    site: singleton({
      label: "Site (nav, footer, contact)",
      path: "content/keystatic/site/",
      format: { data: "yaml" },
      schema: {
        nav: fields.object({
          brandPrimary: fields.text({ label: "Brand primary (e.g. GHOSTBIRTH)" }),
          brandAccent: fields.text({ label: "Brand accent (e.g. II)" }),
          links: fields.array(
            fields.object({
              label: fields.text({ label: "Label" }),
              href: fields.text({ label: "Href (e.g. /#about or /connect)" }),
            }),
            { label: "Nav links", itemLabel: (l) => l.fields.label.value }
          ),
          producersLabel: fields.text({ label: "Producers pill label" }),
          producersHref: fields.text({ label: "Producers pill href" }),
        }),
        contact: fields.object({
          email: fields.text({ label: "Email" }),
          phone: fields.text({ label: "Phone" }),
          phoneDigits: fields.text({ label: "Phone digits (for tel: link)" }),
          instagramHandle: fields.text({ label: "Instagram handle" }),
          instagramUrl: fields.url({ label: "Instagram URL" }),
        }),
        footer: fields.object({
          wordmarkLine1: fields.text({ label: "Wordmark line 1" }),
          wordmarkLine2Primary: fields.text({ label: "Wordmark line 2 primary" }),
          wordmarkLine2Accent: fields.text({ label: "Wordmark line 2 accent" }),
          side: fields.text({ label: "Side blurb", multiline: true }),
          blocks: fields.array(
            fields.object({
              heading: fields.text({ label: "Heading" }),
              lines: fields.array(
                fields.object({
                  text: fields.text({ label: "Text" }),
                  href: fields.text({ label: "Href (optional)" }),
                }),
                { label: "Lines", itemLabel: (l) => l.fields.text.value }
              ),
            }),
            { label: "Footer columns", itemLabel: (b) => b.fields.heading.value }
          ),
          bottomLines: fields.array(fields.text({ label: "Line" }), {
            label: "Bottom bar lines",
            itemLabel: (l) => l.value,
          }),
        }),
      },
    }),

    home: singleton({
      label: "The Film page",
      path: "content/keystatic/home/",
      format: { data: "yaml" },
      schema: {
        hero: fields.object(
          {
            tag: fields.text({ label: "Tag line (e.g. A Film by... · In Development)" }),
            titleLine1: fields.text({ label: "Title line 1" }),
            titleLine2Primary: fields.text({ label: "Title line 2 primary" }),
            titleLine2Accent: fields.text({ label: "Title line 2 accent" }),
            sub: fields.text({ label: "Sub (e.g. BODY HORROR · BANGKOK · 90 MIN)" }),
            lede: fields.text({ label: "Lede paragraph", multiline: true }),
            ctaPrimaryLabel: fields.text({ label: "Primary CTA label" }),
            ctaPrimaryHref: fields.text({ label: "Primary CTA href" }),
            ctaGhostLabel: fields.text({ label: "Ghost CTA label" }),
            ctaGhostHref: fields.text({ label: "Ghost CTA href" }),
            posterImage: image("public/cms/hero", "/cms/hero/"),
            stats: labelValueRow("Hero stats"),
            introVideo: videoAfter(),
          },
          { label: "§ Hero" }
        ),
        about: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            paragraphs: paragraphs("Paragraphs (use *word* for red em, **word** for twist)"),
            pullQuote: fields.text({
              label: "Pull quote (renders between 1st and 2nd paragraph)",
              multiline: true,
            }),
            lineageHeading: fields.text({ label: "Lineage heading" }),
            lineage: fields.array(
              fields.object({
                label: fields.text({ label: "Label (e.g. From / Toward / Through)" }),
                value: fields.text({ label: "Value" }),
              }),
              { label: "Lineage", itemLabel: (r) => r.fields.label.value }
            ),
            methodHeading: fields.text({ label: "Method heading" }),
            materials: fields.array(
              fields.object({
                text: fields.text({ label: "Chip text" }),
                hot: fields.checkbox({ label: "Hot (red filled)" }),
              }),
              { label: "Materials", itemLabel: (m) => m.fields.text.value }
            ),
            videoAfter: videoAfter(),
          },
          { label: "§ About" }
        ),
        statement: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            meta: fields.text({ label: "Meta line" }),
            pdfLabel: fields.text({ label: "PDF button label" }),
            pdfHref: fields.text({ label: "PDF URL (optional)" }),
            body: fields.text({
              label: "Body (blank line separates paragraphs, *word* for red em)",
              multiline: true,
            }),
            videoAfter: videoAfter(),
          },
          { label: "§ Director's Statement" }
        ),
        gallery: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            facts: fields.array(
              fields.object({
                value: fields.text({ label: "Value (big)" }),
                label: fields.text({ label: "Label" }),
              }),
              { label: "Facts", itemLabel: (f) => f.fields.label.value }
            ),
            images: imageArray(
              "Images",
              "public/cms/film-test-shoot",
              "/cms/film-test-shoot/"
            ),
          },
          { label: "§ Test Shoot (gallery)" }
        ),
        director: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            portraitImage: image("public/cms/director", "/cms/director/"),
            paragraphs: paragraphs("Paragraphs"),
            stats: fields.array(
              fields.object({
                value: fields.text({ label: "Number" }),
                label: fields.text({ label: "Label", multiline: true }),
              }),
              { label: "Stats", itemLabel: (s) => s.fields.value.value }
            ),
            videoAfter: videoAfter(),
          },
          { label: "§ Director" }
        ),
        foundation: fields.object(
          {
            marquee: fields.array(
              fields.text({ label: "Marquee item" }),
              { label: "Marquee (joined with · and looped)", itemLabel: (i) => i.value }
            ),
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            year: fields.text({ label: "Year (big red display number)" }),
            hookLine: fields.text({
              label: "Hook line 1 (use *word* for italic white em)",
            }),
            hookPrize: fields.text({ label: "Hook line 2 (red, the 'prize' line)" }),
            sub: fields.text({ label: "Sub line (small caps under hook)" }),
            plateImage: image("public/cms/foundation", "/cms/foundation/"),
            plateLabel: fields.text({ label: "Plate placeholder label (when no image)" }),
            plateCorner: fields.text({ label: "Plate bottom-right corner label" }),
            col1Kicker: fields.text({ label: "Column 1 kicker (e.g. Then)" }),
            col1Body: fields.text({
              label: "Column 1 body (use *word* for red em)",
              multiline: true,
            }),
            col2Kicker: fields.text({ label: "Column 2 kicker (e.g. Now)" }),
            col2Body: fields.text({
              label: "Column 2 body (use *word* for red em)",
              multiline: true,
            }),
            meta: fields.array(
              fields.object({
                label: fields.text({ label: "Label" }),
                value: fields.text({
                  label: "Value (newlines allowed, *word* for red em)",
                  multiline: true,
                }),
              }),
              { label: "Meta cells (4 total)", itemLabel: (r) => r.fields.label.value }
            ),
            video: videoAfter(),
          },
          { label: "§ Foundation" }
        ),
        invite: fields.object(
          {
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            body: fields.text({ label: "Body", multiline: true }),
            ctaLabel: fields.text({ label: "CTA label" }),
            ctaHref: fields.text({ label: "CTA href" }),
          },
          { label: "§ Invite" }
        ),
      },
    }),

    pitch: singleton({
      label: "For Producers page",
      path: "content/keystatic/pitch/",
      format: { data: "yaml" },
      schema: {
        hero: fields.object(
          {
            tag: fields.text({ label: "Tag" }),
            titleLine1: fields.text({ label: "Title line 1" }),
            titleLine2: fields.text({ label: "Title line 2 (red em)" }),
            oneliner: fields.array(
              fields.object({
                label: fields.text({ label: "Label" }),
                value: fields.text({ label: "Value (use *word* for red em)", multiline: true }),
              }),
              { label: "Oneliner cells", itemLabel: (c) => c.fields.label.value }
            ),
            videoAfter: videoAfter(),
          },
          { label: "§ Hero" }
        ),
        synopsis: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            spoilerTag: fields.text({ label: "Spoiler tag text" }),
            paragraphs: paragraphs("Paragraphs"),
            endCard: fields.text({ label: "End card (use *word* for red em)" }),
            sizzleNote: fields.text({ label: "Sizzle note (optional)" }),
            videoAfter: videoAfter(),
          },
          { label: "§ Synopsis" }
        ),
        status: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            cards: fields.array(
              fields.object({
                heading: fields.text({ label: "Heading" }),
                body: fields.text({ label: "Body (use *word* for red em)", multiline: true }),
              }),
              { label: "Cards", itemLabel: (c) => c.fields.heading.value }
            ),
            seekingTitle: fields.text({ label: "Seeking title (use *word* for red em)" }),
            seekingBody: fields.text({ label: "Seeking body (use *word* for red em)", multiline: true }),
            videoAfter: videoAfter(),
          },
          { label: "§ Status" }
        ),
        whyNow: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            body: fields.text({
              label: "Body (blank line separates paragraphs, *word* for red em)",
              multiline: true,
            }),
          },
          { label: "§ Why Now" }
        ),
        timeline: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            steps: fields.array(
              fields.object({
                when: fields.text({ label: "When" }),
                what: fields.text({ label: "What" }),
                detail: fields.text({ label: "Detail (optional)" }),
                state: fields.select({
                  label: "State",
                  options: [
                    { label: "Done", value: "done" },
                    { label: "Now", value: "now" },
                    { label: "Upcoming", value: "" },
                  ],
                  defaultValue: "",
                }),
              }),
              { label: "Steps", itemLabel: (s) => s.fields.what.value }
            ),
            videoAfter: videoAfter(),
          },
          { label: "§ Timeline" }
        ),
        visual: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            leftHeading: fields.text({ label: "Left column heading" }),
            leftBody: fields.text({ label: "Left body (use *word* for red em)", multiline: true }),
            positioning: fields.array(
              fields.object({
                label: fields.text({ label: "Label (e.g. In the lineage of)" }),
                value: fields.text({ label: "Value" }),
              }),
              { label: "Positioning", itemLabel: (r) => r.fields.label.value }
            ),
            rightHeading: fields.text({ label: "Right column heading" }),
            rightBody: fields.text({ label: "Right body (use *word* for red em)", multiline: true }),
            vetoes: fields.array(fields.text({ label: "Veto (NO prefixed)" }), {
              label: "Vetoes",
              itemLabel: (v) => v.value,
            }),
            videoAfter: videoAfter(),
          },
          { label: "§ Visual Approach" }
        ),
        downloads: fields.object(
          {
            sectionLabelNum: fields.text({ label: "Section number" }),
            sectionLabel: fields.text({ label: "Section label" }),
            title: fields.text({ label: "Big title (use *word* for red em)" }),
            items: fields.array(
              fields.object({
                type: fields.text({ label: "Type (e.g. PDF · 14 pages)" }),
                name: fields.text({ label: "Name" }),
                detail: fields.text({ label: "Detail" }),
                file: fields.file({
                  label: "PDF file",
                  directory: "public/cms/downloads",
                  publicPath: "/cms/downloads/",
                }),
              }),
              { label: "Items", itemLabel: (i) => i.fields.name.value }
            ),
            scriptCard: fields.object({
              type: fields.text({ label: "Type" }),
              name: fields.text({ label: "Name" }),
              detail: fields.text({ label: "Detail", multiline: true }),
              file: fields.file({
                label: "PDF file (optional)",
                directory: "public/cms/downloads",
                publicPath: "/cms/downloads/",
              }),
            }),
            videoAfter: videoAfter(),
          },
          { label: "§ Downloads" }
        ),
      },
    }),

    connect: singleton({
      label: "Connect page",
      path: "content/keystatic/connect/",
      format: { data: "yaml" },
      schema: {
        topVideo: fields.object({
          src: fields.url({ label: "Top video URL (HLS .m3u8 or .mp4, optional)" }),
          label: fields.text({ label: "Label" }),
        }),
        sectionLabelNum: fields.text({ label: "Section number" }),
        sectionLabel: fields.text({ label: "Section label" }),
        title: fields.text({ label: "Big title (use *word* for red em)" }),
        lede: fields.text({ label: "Lede", multiline: true }),
        formTitle: fields.text({ label: "Form title" }),
        formSub: fields.text({ label: "Form subtitle" }),
        roleLabel: fields.text({ label: "Role label" }),
        emailLabel: fields.text({ label: "Email field label" }),
        emailPlaceholder: fields.text({ label: "Email placeholder" }),
        submitLabel: fields.text({ label: "Submit label" }),
        submitDoneLabel: fields.text({ label: "Submit done label" }),
        roles: fields.array(fields.text({ label: "Role" }), {
          label: "Roles",
          itemLabel: (r) => r.value,
        }),
      },
    }),
  },
});
