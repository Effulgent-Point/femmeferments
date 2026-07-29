import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroShatter from "@/components/HeroShatter";
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
import content from "@/data/content.json";

export const metadata = {
  title: "Concept 2 — Flowing + Fast Shatter",
};

export default function Concept2() {
  return (
    <>
      <Navbar />
      <main>
        <h1 className="sr-only">
          Femme Ferments — Beauty in the Broken Glass
        </h1>
        <HeroShatter speed="fast" showChapterEyebrow={false} />

        <Section
          id="vision"
          bg="cream"
          bgPieces={[
            { file: "01_left_outer_teal_points_tight.png", width: "55%", top: "-8%", left: "-12%" },
            { file: "02_left_top_teal_shards_tight.png", width: "50%", bottom: "-10%", right: "-14%" },
          ]}
        >
          <SectionHeading>{content.vision.headline}</SectionHeading>
          <p
            className="max-w-2xl leading-relaxed"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
            }}
          >
            {content.vision.body}
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
            &ldquo;{content.vision.quote}&rdquo;
          </p>
        </Section>

        <Section
          bg="parchment"
          bgPieces={[
            { file: "06_upper_mid_green_crown_tight.png", width: "52%", top: "-6%", right: "-10%" },
            { file: "07_mid_left_green_bridge_tight.png", width: "48%", bottom: "-12%", left: "-10%" },
          ]}
        >
          <SectionHeading>{content.valley.headline}</SectionHeading>
          <p
            className="max-w-2xl leading-relaxed"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
            }}
          >
            {content.valley.body}
          </p>
          {content.valley.ctas.map((cta, i) => (
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
          bg="cream"
          bgPieces={[
            { file: "10_upper_yellow_orange_tight.png", width: "46%", top: "-6%", left: "-8%" },
            { file: "11_right_upper_pink_orange_tight.png", width: "50%", bottom: "-10%", right: "-12%" },
          ]}
        >
          <SectionHeading>The Craft</SectionHeading>
          <WineCards />
        </Section>

        <Section
          bg="parchment"
          bgPieces={[
            { file: "08_center_core_burst_tight.png", width: "44%", top: "-8%", right: "-6%" },
            { file: "13_right_mid_teal_glass_tight.png", width: "48%", bottom: "-10%", left: "-8%" },
          ]}
        >
          <SectionHeading>The Mission</SectionHeading>
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
              of our profits empower women
            </p>
          </div>
          <FlowSteps />
        </Section>

        <Section id="community" bg="cream">
          <SectionHeading>Six Ways to Pour Yourself In</SectionHeading>
          <p
            className="max-w-xl leading-relaxed"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
            }}
          >
            Femme Ferments only works because a whole community pours itself
            in. Here is where you fit.
          </p>
          <SpecimenCards />
        </Section>

        <Section
          id="events"
          bg="parchment"
          bgPieces={[
            { file: "14_right_warm_red_orange_tight.png", width: "46%", top: "-8%", right: "-8%" },
          ]}
        >
          <SectionHeading>Gather</SectionHeading>
          <EventCard />
        </Section>

        <Section bg="cream">
          <SectionHeading>Our Partners &amp; Supporters</SectionHeading>
          <PartnerMarquee />
        </Section>

        <section
          id="join"
          className="relative flex flex-col items-center text-center"
          style={{
            padding: "6rem 0 7rem",
            background: "var(--parchment)",
          }}
        >
          <GlassAssembly />
          <div className="px-6 w-full flex flex-col items-center">
            <SectionHeading>Every Piece Makes the Picture</SectionHeading>
            <JoinForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
