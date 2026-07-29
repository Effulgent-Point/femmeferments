/**
 * Floating marker shown on /preview so it's unmistakable the page is an
 * unpublished draft, not the live site. Links back to the editor.
 */
export default function PreviewBanner() {
  return (
    <aside
      role="complementary"
      aria-label="Preview mode"
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        background: "var(--wine)",
        color: "var(--cream)",
        padding: "0.6rem 1.1rem",
        borderRadius: "99px",
        fontFamily: "var(--font-sans)",
        fontSize: "0.8rem",
        display: "flex",
        gap: "0.9rem",
        alignItems: "center",
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ fontWeight: 600, letterSpacing: "0.02em" }}>
        Preview — unpublished draft
      </span>
      <a
        href="/bosslogin"
        style={{ color: "var(--gold)", fontWeight: 600, textDecoration: "none" }}
      >
        Back to editor &rarr;
      </a>
    </aside>
  );
}
