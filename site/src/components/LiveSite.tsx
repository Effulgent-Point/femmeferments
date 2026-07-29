import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroGlassFirst from "@/components/HeroGlassFirst";
import GlassAssembly from "@/components/GlassAssembly";
import SpecimenCards from "@/components/SpecimenCards";
import WineCards from "@/components/WineCards";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import Counter from "@/components/Counter";
import FlowSteps from "@/components/FlowSteps";
import CtaBox from "@/components/CtaBox";
import PartnerMarquee from "@/components/PartnerMarquee";
import EventCard from "@/components/EventCard";
import JoinForm from "@/components/JoinForm";
import ContactSection from "@/components/sections/ContactSection";
import GallerySection from "@/components/sections/GallerySection";
import DonateSection from "@/components/sections/DonateSection";
import NewsSection from "@/components/sections/NewsSection";
import TeamSection from "@/components/sections/TeamSection";
import { type Content, type SectionId } from "@/lib/content";

/**
 * The live public site (the chosen "Glass-First Hero" design), served at "/".
 * Sections render in the order/visibility of `content.sectionLayout`, so the
 * editor can hide, show, and reorder them. Chapter eyebrows auto-number by
 * position, and the nav is derived from the enabled sections. The Join section
 * is always last (it's the fixed sign-up finale, not part of the layout).
 */

type Bg = "cream" | "parchment";

const NUMBER_WORDS = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];

// Which sections show a "Chapter N" eyebrow, and their short nav label (null = not in nav).
const HAS_CHAPTER: Record<SectionId, boolean> = {
  vision: true,
  land: true,
  wines: true,
  mission: true,
  community: true,
  events: true,
  partners: false,
  contact: true,
  gallery: true,
  donate: true,
  news: true,
  team: true,
};
const NAV_LABEL: Record<SectionId, string | null> = {
  vision: "Vision",
  land: null,
  wines: "Wines",
  mission: null,
  community: "Community",
  events: "Events",
  partners: null,
  contact: "Contact",
  gallery: "Gallery",
  donate: "Donate",
  news: "News",
  team: "Team",
};

function renderSection(
  id: SectionId,
  c: Content,
  chapter: string | undefined,
  bg: Bg,
) {
  const bodyStyle: React.CSSProperties = {
    color: "var(--ink-dim)",
    fontFamily: "var(--font-sans)",
    fontSize: "1rem",
  };
  switch (id) {
    case "vision":
      return (
        <Section
          id="vision"
          bg={bg}
          chapter={chapter}
          bgPieces={[
            {
              file: "01_left_outer_teal_points_tight.png",
              width: "55%",
              top: "-8%",
              left: "-12%",
            },
            {
              file: "02_left_top_teal_shards_tight.png",
              width: "50%",
              bottom: "-10%",
              right: "-14%",
            },
          ]}
        >
          <SectionHeading>{c.vision.headline}</SectionHeading>
          <p className="max-w-2xl leading-relaxed" style={bodyStyle}>
            {c.vision.body}
          </p>
          <p
            className="max-w-xl mt-10 leading-normal"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
              color: "var(--wine)",
            }}
          >
            &ldquo;{c.vision.quote}&rdquo;
          </p>
        </Section>
      );
    case "land":
      return (
        <Section
          id="land"
          bg={bg}
          chapter={chapter}
          bgPieces={[
            {
              file: "06_upper_mid_green_crown_tight.png",
              width: "52%",
              top: "-6%",
              right: "-10%",
            },
            {
              file: "07_mid_left_green_bridge_tight.png",
              width: "48%",
              bottom: "-12%",
              left: "-10%",
            },
          ]}
        >
          <SectionHeading>{c.valley.headline}</SectionHeading>
          <p className="max-w-2xl leading-relaxed" style={bodyStyle}>
            {c.valley.body}
          </p>
          {c.valley.ctas.map((cta, i) => (
            <CtaBox
              key={i}
              label={cta.label}
              heading={cta.heading}
              description={cta.description}
            />
          ))}
        </Section>
      );
    case "wines":
      return (
        <Section
          id="wines"
          bg={bg}
          chapter={chapter}
          bgPieces={[
            {
              file: "10_upper_yellow_orange_tight.png",
              width: "46%",
              top: "-6%",
              left: "-8%",
            },
            {
              file: "11_right_upper_pink_orange_tight.png",
              width: "50%",
              bottom: "-10%",
              right: "-12%",
            },
          ]}
        >
          <SectionHeading>{c.sections.wines.heading}</SectionHeading>
          <p
            className="max-w-xl leading-relaxed"
            style={{ ...bodyStyle, fontSize: "0.95rem" }}
          >
            {c.sections.wines.intro}
          </p>
          <WineCards wines={c.wines} />
        </Section>
      );
    case "mission":
      return (
        <Section
          id="mission"
          bg={bg}
          chapter={chapter}
          bgPieces={[
            {
              file: "08_center_core_burst_tight.png",
              width: "44%",
              top: "-8%",
              right: "-6%",
            },
            {
              file: "13_right_mid_teal_glass_tight.png",
              width: "48%",
              bottom: "-10%",
              left: "-8%",
            },
          ]}
        >
          <SectionHeading>{c.sections.mission.heading}</SectionHeading>
          <div className="flex flex-col items-center gap-2 mt-6">
            <div
              className="text-6xl md:text-7xl"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--wine)",
                fontWeight: 700,
              }}
            >
              <Counter target={100} />
            </div>
            <p
              className="text-sm tracking-wide uppercase"
              style={{
                color: "var(--copper-text)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
              }}
            >
              {c.sections.mission.caption}
            </p>
          </div>
          <FlowSteps steps={c.flowSteps} />
        </Section>
      );
    case "community":
      return (
        <Section id="community" bg={bg} chapter={chapter}>
          <SectionHeading>{c.sections.community.heading}</SectionHeading>
          <p
            className="max-w-xl leading-relaxed"
            style={{ ...bodyStyle, fontSize: "0.95rem" }}
          >
            {c.sections.community.intro}
          </p>
          <SpecimenCards roles={c.roles} />
        </Section>
      );
    case "events":
      return (
        <Section
          id="events"
          bg={bg}
          chapter={chapter}
          bgPieces={[
            {
              file: "14_right_warm_red_orange_tight.png",
              width: "46%",
              top: "-8%",
              right: "-8%",
            },
          ]}
        >
          <SectionHeading>{c.sections.events.heading}</SectionHeading>
          <EventCard event={c.event} />
        </Section>
      );
    case "partners":
      return (
        <Section id="partners" bg={bg}>
          <SectionHeading>{c.sections.partners.heading}</SectionHeading>
          <PartnerMarquee partners={c.partners} />
        </Section>
      );
    case "contact":
      return (
        <ContactSection
          data={c.contact}
          heading={c.sections.contact.heading}
          chapter={chapter}
          bg={bg}
        />
      );
    case "gallery":
      return (
        <GallerySection
          data={c.gallery}
          heading={c.sections.gallery.heading}
          chapter={chapter}
          bg={bg}
        />
      );
    case "donate":
      return (
        <DonateSection
          data={c.donate}
          heading={c.sections.donate.heading}
          chapter={chapter}
          bg={bg}
        />
      );
    case "news":
      return (
        <NewsSection
          data={c.news}
          heading={c.sections.news.heading}
          chapter={chapter}
          bg={bg}
        />
      );
    case "team":
      return (
        <TeamSection
          data={c.team}
          heading={c.sections.team.heading}
          chapter={chapter}
          bg={bg}
        />
      );
    default:
      return null;
  }
}

export default function LiveSite({ content: c }: { content: Content }) {
  const enabled = c.sectionLayout.filter((s) => s.enabled);
  const navLinks = enabled
    .filter((s) => NAV_LABEL[s.id])
    .map((s) => ({ label: NAV_LABEL[s.id] as string, href: `#${s.id}` }));
  navLinks.push({ label: "Join", href: "#join" });

  let chapterNo = 0;
  return (
    <>
      <Navbar links={navLinks} />
      <main>
        <h1 className="sr-only">Femme Ferments — Beauty in the Broken Glass</h1>
        <HeroGlassFirst />

        {enabled.map((entry, i) => {
          const bg: Bg = i % 2 === 0 ? "parchment" : "cream";
          const chapter = HAS_CHAPTER[entry.id]
            ? `Chapter ${NUMBER_WORDS[chapterNo++] ?? String(chapterNo)}`
            : undefined;
          return (
            <React.Fragment key={entry.id}>
              {renderSection(entry.id, c, chapter, bg)}
            </React.Fragment>
          );
        })}

        {/* Join finale — always last, not part of the reorderable layout */}
        <section
          id="join"
          className="relative flex flex-col items-center text-center"
          style={{ padding: "6rem 0 7rem", background: "var(--cream)" }}
        >
          <div
            className="text-xs tracking-[0.25em] uppercase mb-6"
            style={{
              color: "var(--gold-text)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
            }}
          >
            {c.sections.join.eyebrow}
          </div>
          <GlassAssembly />
          <div className="px-6 w-full flex flex-col items-center">
            <SectionHeading>{c.sections.join.heading}</SectionHeading>
            <JoinForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
