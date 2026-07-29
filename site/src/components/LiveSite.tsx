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
import { type Content } from "@/lib/content";

/**
 * The live public site (the chosen "Glass-First Hero" design), served at "/".
 * Server component: it receives already-merged published content as a prop from
 * the page (which reads it server-side with ISR), so the very first paint has
 * the real content — no client fetch, no post-hydration text flash. On a static
 * host the page hands it DEFAULT_CONTENT instead — see docs/cms-static-version.md.
 */
export default function LiveSite({ content: c }: { content: Content }) {
  return (
    <>
      <Navbar />
      <main>
        <h1 className="sr-only">Femme Ferments — Beauty in the Broken Glass</h1>
        <HeroGlassFirst />

        <Section
          id="vision"
          bg="parchment"
          chapter="Chapter One"
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
          <p
            className="max-w-2xl leading-relaxed"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
            }}
          >
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

        <Section
          bg="cream"
          chapter="Chapter Two"
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
          <p
            className="max-w-2xl leading-relaxed"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
            }}
          >
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

        <Section
          id="wines"
          bg="parchment"
          chapter="Chapter Three"
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
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
            }}
          >
            {c.sections.wines.intro}
          </p>
          <WineCards wines={c.wines} />
        </Section>

        <Section
          bg="cream"
          chapter="Chapter Four"
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

        <Section id="community" bg="parchment" chapter="Chapter Five">
          <SectionHeading>{c.sections.community.heading}</SectionHeading>
          <p
            className="max-w-xl leading-relaxed"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
            }}
          >
            {c.sections.community.intro}
          </p>
          <SpecimenCards roles={c.roles} />
        </Section>

        <Section
          id="events"
          bg="cream"
          chapter="Chapter Six"
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

        <Section bg="parchment">
          <SectionHeading>{c.sections.partners.heading}</SectionHeading>
          <PartnerMarquee partners={c.partners} />
        </Section>

        <section
          id="join"
          className="relative flex flex-col items-center text-center"
          style={{
            padding: "6rem 0 7rem",
            background: "var(--cream)",
          }}
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
