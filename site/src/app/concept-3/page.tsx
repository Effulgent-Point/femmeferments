import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroLabel from "@/components/HeroLabel";
import GlassAssembly from "@/components/GlassAssembly";
import SpecimenCards from "@/components/SpecimenCards";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import Counter from "@/components/Counter";
import FlowSteps from "@/components/FlowSteps";
import CtaBox from "@/components/CtaBox";
import PartnerMarquee from "@/components/PartnerMarquee";
import EventCard from "@/components/EventCard";
import JoinForm from "@/components/JoinForm";
import Reveal from "@/components/Reveal";
import content from "@/data/content.json";

export const metadata = {
  title: "Concept 3 — The Back Label",
};

export default function Concept3() {
  return (
    <>
      <Navbar />
      <main>
        <h1 className="sr-only">
          Femme Ferments — Beauty in the Broken Glass
        </h1>
        <HeroLabel />

        <Section
          id="vision"
          bg="cream"
          chapter="Chapter One"
          bgPieces={[
            { file: "01_left_outer_teal_points_tight.png", width: "52%", top: "-8%", left: "-12%" },
          ]}
        >
          <SectionHeading>{content.vision.headline}</SectionHeading>
          <p
            className="drop-cap max-w-2xl"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "1.02rem",
              lineHeight: 1.85,
              textAlign: "left",
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
          chapter="Chapter Two"
          bgPieces={[
            { file: "06_upper_mid_green_crown_tight.png", width: "50%", top: "-6%", right: "-10%" },
          ]}
        >
          <SectionHeading>{content.valley.headline}</SectionHeading>
          <p
            className="drop-cap max-w-2xl"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "1.02rem",
              lineHeight: 1.85,
              textAlign: "left",
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

        {/* The Craft — dark wine cellar panel, glass glowing */}
        <section
          id="wines"
          className="relative overflow-hidden flex flex-col items-center text-center"
          style={{ padding: "6.5rem 1.5rem", background: "var(--wine)" }}
        >
          <Image
            src="/glass-assets/tight_png/10_upper_yellow_orange_tight.png"
            alt=""
            aria-hidden="true"
            width={338}
            height={281}
            loading="lazy"
            sizes="60vw"
            className="bg-glass-piece absolute pointer-events-none"
            style={{ width: "48%", height: "auto", top: "-8%", left: "-10%", opacity: 0.3, zIndex: 1 }}
          />
          <Image
            src="/glass-assets/tight_png/15_right_lower_blue_purple_tight.png"
            alt=""
            aria-hidden="true"
            width={371}
            height={399}
            loading="lazy"
            sizes="60vw"
            className="bg-glass-piece absolute pointer-events-none"
            style={{ width: "50%", height: "auto", bottom: "-12%", right: "-10%", opacity: 0.3, zIndex: 1 }}
          />
          <div className="relative w-full flex flex-col items-center" style={{ zIndex: 2 }}>
            <Reveal>
              <div
                className="text-xs tracking-[0.25em] uppercase mb-4"
                style={{
                  color: "var(--gold)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                }}
              >
                Chapter Three
              </div>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--cream)",
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  fontWeight: 600,
                }}
              >
                The Craft
              </h2>
              <p
                className="max-w-xl leading-relaxed"
                style={{
                  color: "rgba(250, 245, 235, 0.72)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.95rem",
                }}
              >
                Small-batch wines crafted from donated fruit and borrowed
                cellars.
              </p>
              <div
                className="grid gap-8 max-w-[900px] mx-auto mt-10 w-full"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                {content.wines.map((wine) => (
                  <div
                    key={wine.varietal}
                    className="text-center p-10"
                    style={{
                      background: "var(--parchment)",
                      border: "1px solid rgba(201, 168, 76, 0.5)",
                      boxShadow: "0 14px 44px rgba(0, 0, 0, 0.35)",
                    }}
                  >
                    <div
                      className="text-xs tracking-[0.2em] uppercase mb-2"
                      style={{
                        color: "var(--gold-text)",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                      }}
                    >
                      {wine.year} {wine.varietal}
                    </div>
                    <div
                      className="relative mx-auto mb-5"
                      style={{ width: "40px", height: "10px" }}
                    >
                      <span
                        className="absolute left-0 right-0"
                        style={{
                          top: "50%",
                          height: "1px",
                          background: "var(--gold)",
                        }}
                      />
                      <span
                        className="absolute"
                        style={{
                          top: "50%",
                          left: "50%",
                          width: "5px",
                          height: "5px",
                          transform: "translate(-50%, -50%) rotate(45deg)",
                          background: "var(--gold)",
                        }}
                      />
                    </div>
                    <h3
                      className="text-2xl mb-4"
                      style={{
                        fontFamily: "var(--font-serif)",
                        color: "var(--wine)",
                        fontWeight: 600,
                        fontStyle: "italic",
                      }}
                    >
                      {wine.name}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{
                        color: "var(--ink-dim)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {wine.description}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <Section
          bg="cream"
          chapter="Chapter Four"
          bgPieces={[
            { file: "08_center_core_burst_tight.png", width: "44%", top: "-8%", right: "-6%" },
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

        <Section id="community" bg="parchment" chapter="Chapter Five">
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
          bg="cream"
          chapter="Chapter Six"
          bgPieces={[
            { file: "14_right_warm_red_orange_tight.png", width: "46%", top: "-8%", right: "-8%" },
          ]}
        >
          <SectionHeading>Gather</SectionHeading>
          <EventCard />
        </Section>

        <Section bg="parchment">
          <SectionHeading>Our Partners &amp; Supporters</SectionHeading>
          <PartnerMarquee />
        </Section>

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
            Come Together
          </div>
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
