export default function SectionHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2
      className="text-4xl md:text-5xl mb-6"
      style={{
        fontFamily: "var(--font-serif)",
        color: "var(--wine)",
        fontWeight: 600,
      }}
    >
      {children}
    </h2>
  );
}
