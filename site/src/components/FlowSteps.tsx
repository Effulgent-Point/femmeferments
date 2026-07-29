import content from "@/data/content.json";
import type { FlowStep } from "@/lib/content";

export default function FlowSteps({ steps }: { steps?: FlowStep[] }) {
  const list = steps ?? (content.flowSteps as FlowStep[]);
  return (
    <ul className="list-none flex flex-col gap-7 max-w-xl mx-auto mt-12 w-full">
      {list.map((step, i) => (
        <li key={step.title} className="flex items-start gap-5 text-left">
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: "1px solid var(--gold)",
              color: "var(--gold-text)",
              fontFamily: "var(--font-serif)",
              fontSize: "1.15rem",
              fontWeight: 600,
            }}
          >
            {i + 1}
          </div>
          <div>
            <div
              className="mb-1"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--wine)",
                fontSize: "1.15rem",
                fontWeight: 600,
              }}
            >
              {step.title}
            </div>
            <p
              className="leading-relaxed"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
              }}
            >
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
