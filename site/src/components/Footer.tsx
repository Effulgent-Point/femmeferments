export default function Footer() {
  return (
    <footer
      className="text-center py-10"
      style={{
        background: "var(--wine)",
        color: "rgba(250, 245, 235, 0.6)",
        fontFamily: "var(--font-sans)",
        fontSize: "0.8rem",
        letterSpacing: "0.06em",
      }}
    >
      <p>
        Made with ❤️ by{" "}
        <a
          href="https://effulgentpoint.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--gold)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(201, 168, 76, 0.3)",
          }}
        >
          Effulgent Point
        </a>
      </p>
    </footer>
  );
}
